import { User } from "@/entrypoints/models/User";
import { Settings } from "../entrypoints/models/Settings";

const API_URL = "https://api.groundedmomentum.com/api/gramcontrol";
const EPOCH = "1970-01-01T00:00:00.000Z";

const FIELDS = [
  "recommendationsDisabled",
  "explorePageDisabled",
  "reelsPageDisabled",
  "suggestedFriendsDisabled",
  "commentsDisabled",
] as const;

const apiFetch = (
  authToken: string,
  init: RequestInit = {}
): Promise<Response> =>
  fetch(API_URL, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      ...(init.headers ?? {}),
    },
  });

export const saveSettings = async (
  newSettings: Settings,
  user: User | undefined
): Promise<void> => {
  const result = (await browser.storage.local.get("settings")) as {
    settings?: Record<string, any>;
  };
  const prev = result.settings ?? {};

  const next: Record<string, any> = { ...prev };
  const newValues = newSettings.toJSON() as Record<string, boolean>;
  const now = new Date().toISOString();

  for (const field of FIELDS) {
    const tsField = `${field}UpdatedAt`;
    const newVal = newValues[field];
    const prevVal = prev[field];
    if (newVal !== prevVal || prev[tsField] === undefined) {
      next[field] = newVal;
      next[tsField] = now;
    }
  }

  await browser.storage.local.set({ settings: next });

  if (!user || !user.extensionsPlus) return;

  try {
    const response = await apiFetch(user.authToken, {
      method: "PUT",
      body: JSON.stringify(next),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save settings to backend");
    }

    const data = await response.json();
    if (data?.data) {
      await browser.storage.local.set({ settings: data.data });
    }
  } catch (error) {
    console.error("Error saving settings to cloud:", error);
    throw error;
  }
};

export const loadSettings = async (): Promise<{
  settings: Settings;
  user: User | undefined;
}> => {
  const result = (await browser.storage.local.get(["user", "settings"])) as {
    user?: any;
    settings?: Record<string, any>;
  };

  const user: User | undefined = result.user ? User.fromJSON(result.user) : undefined;
  const local = result.settings ?? {};

  if (!user || !user.extensionsPlus) {
    return { settings: Settings.fromJSON(local as any), user };
  }

  try {
    const response = await apiFetch(user.authToken);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch settings from backend");
    }

    const json = await response.json();
    const server = (json?.data ?? {}) as Record<string, any>;

    const merged: Record<string, any> = { ...local };
    const pushPayload: Record<string, any> = {};

    for (const field of FIELDS) {
      const tsField = `${field}UpdatedAt`;
      const localValue = local[field];
      const localTs: string | undefined = local[tsField];
      const serverValue = server[field];
      const serverTs: string | undefined = server[tsField];

      if (localValue === undefined && serverValue !== undefined && serverTs) {
        merged[field] = serverValue;
        merged[tsField] = serverTs;
        continue;
      }

      if (localValue === undefined) continue;

      const effectiveLocalTs = localTs ?? EPOCH;
      if (!serverTs || effectiveLocalTs >= serverTs) {
        pushPayload[field] = localValue;
        pushPayload[tsField] = effectiveLocalTs;
      } else {
        merged[field] = serverValue;
        merged[tsField] = serverTs;
      }
    }

    await browser.storage.local.set({ settings: merged });

    if (Object.keys(pushPayload).length > 0) {
      apiFetch(user.authToken, {
        method: "PUT",
        body: JSON.stringify(pushPayload),
      }).catch(() => {});
    }

    return { settings: Settings.fromJSON(merged as any), user };
  } catch (error) {
    console.error("Error fetching settings from backend:", error);
    return { settings: Settings.fromJSON(local as any), user };
  }
};
