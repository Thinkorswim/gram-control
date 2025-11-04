import { Settings } from "./models/Settings";
import { loadSettings } from "@/lib/settings";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    browser.storage.local.get(["settings"], async (data) => {
      if (!data.settings) {
        const defaultSettings: Settings = Settings.fromJSON({
          recommendationsDisabled: true,
          explorePageDisabled: true,
          reelsPageDisabled: true,
          suggestedFriendsDisabled: true,
          commentsDisabled: false,
        });
        browser.storage.local.set({ settings: defaultSettings.toJSON() });
      }

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
