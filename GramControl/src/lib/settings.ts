import { User } from "@/entrypoints/models/User";
import { Settings } from "../entrypoints/models/Settings";

export const saveSettings = async (
  settings: Settings,
  user: User | undefined
): Promise<void> => {
  // Always save locally first
  await browser.storage.local.set({ settings: settings.toJSON() });

  // If user is Pro, also save to the cloud
  if (user && user.extensionsPlus) {
    try {
      const response = await fetch("https://api.groundedmomentum.com/api/gramcontrol", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.authToken}`,
        },
        body: JSON.stringify(settings.toJSON()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save settings to backend"
        );
      }

      const data = await response.json();

      // Update local storage with the response from backend to ensure sync
      if (data.data) {
        const updatedSettings = Settings.fromJSON(data.data);
        await browser.storage.local.set({ settings: updatedSettings.toJSON() });
      }
    } catch (error) {
      console.error("Error saving settings to cloud:", error);
      // Still throw the error so the UI can handle it
      throw error;
    }
  }
};

export const loadSettings = async (): Promise<{
  settings: Settings;
  user: User | undefined;
}> => {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(["user", "settings"], async (result) => {
      try {
        let user: User | undefined = undefined;

        if (result.user) {
          user = User.fromJSON(result.user);
        }

        const settings = Settings.fromJSON(result.settings);

        if (user && user.extensionsPlus) {
          const response = await fetch(
            "https://api.groundedmomentum.com/api/gramcontrol",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.authToken}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to fetch settings from backend"
            );
          }

          const data = Settings.fromJSON((await response.json()).data);
          browser.storage.local.set({ settings: data.toJSON() });

          resolve({
            settings: data,
            user: user,
          });
        } else {
          resolve({
            settings: settings || new Settings(),
            user: user,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};
