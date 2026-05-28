import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: ({ browser }) => {
    // Names/descriptions are sourced from messages/<locale>.yml so the Chrome,
    // Edge, and Firefox store listings render in each user's language.
    const localized = {
      name: "__MSG_extName__",
      description: "__MSG_extDescription__",
      short_name: "__MSG_extShortName__",
      default_locale: "en",
    } as const;

    // Handle permissions differently for Chrome/Edge (MV3) vs Firefox (MV2).
    // The "storage" permission also covers storage.sync (built-in account sync).
    if (browser === "chrome" || browser === "edge") {
      return {
        ...localized,
        permissions: ["storage"],
        host_permissions: ["*://www.instagram.com/*"],
      };
    } else {
      // Firefox MV2
      return {
        ...localized,
        permissions: ["storage", "*://www.instagram.com/*"],
        // Stable extension ID — required for storage.sync to propagate
        // across devices via the user's Firefox Account.
        browser_specific_settings: {
          gecko: {
            id: "{7c32141b-11fc-4628-84dc-f44756a9476f}",
          },
        },
      };
    }
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  srcDir: "src",
  outDir: "dist",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
