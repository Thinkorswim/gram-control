import { Settings } from "./models/Settings";
import { loadSettings } from "@/lib/settings";

const DEFAULT_SETTINGS = {
  recommendationsDisabled: true,
  explorePageDisabled: true,
  reelsPageDisabled: true,
  suggestedFriendsDisabled: true,
  commentsDisabled: false,
  hideStoriesOnMainPage: false,
};

const SETTING_FIELDS = Object.keys(DEFAULT_SETTINGS) as Array<
  keyof typeof DEFAULT_SETTINGS
>;

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    // Migrate any legacy settings stored in storage.local (pre-sync versions)
    // into storage.sync, dropping the old per-field timestamp keys.
    const local = (await browser.storage.local.get(["settings"])) as {
      settings?: Record<string, any>;
    };
    const synced = (await browser.storage.sync.get("settings")) as {
      settings?: Record<string, any>;
    };

    if (!synced.settings && local.settings) {
      const migrated: Record<string, boolean> = {};
      for (const field of SETTING_FIELDS) {
        migrated[field] =
          typeof local.settings[field] === "boolean"
            ? local.settings[field]
            : DEFAULT_SETTINGS[field];
      }
      await browser.storage.sync.set({ settings: migrated });
    } else if (!synced.settings) {
      await browser.storage.sync.set({
        settings: Settings.fromJSON(DEFAULT_SETTINGS).toJSON(),
      });
    }

    // Clear stale local data left behind by the old account/sync system.
    await browser.storage.local.remove(["settings", "user"]);

    if (details.reason === "install") {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]) {
        await browser.action.openPopup();
      }
    }
  });

  // Handle messages from content scripts
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "LOAD_SETTINGS") {
      loadSettings()
        .then((result) => {
          sendResponse({ success: true, data: result });
        })
        .catch((error) => {
          console.error("Error loading settings in background:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep the message channel open for async response
    }
  });
});
