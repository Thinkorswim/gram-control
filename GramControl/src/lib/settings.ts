import { Settings } from "../entrypoints/models/Settings";

export const saveSettings = async (newSettings: Settings): Promise<void> => {
  await browser.storage.sync.set({ settings: newSettings.toJSON() });
};

export const loadSettings = async (): Promise<{ settings: Settings }> => {
  const result = (await browser.storage.sync.get("settings")) as {
    settings?: Record<string, any>;
  };

  return {
    settings: result.settings
      ? Settings.fromJSON(result.settings as any)
      : new Settings(),
  };
};
