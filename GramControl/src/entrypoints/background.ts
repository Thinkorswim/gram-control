import { Settings } from "./models/Settings";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
          await browser.action.openPopup();
        }
      } catch (error) {
        console.log('Could not open popup automatically:', error);
      }
    }

    browser.storage.local.get(["settings"], (data) => {
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
    });
  });

});
