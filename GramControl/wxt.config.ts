import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: ({ browser }) => {
    // Handle permissions differently for Chrome/Edge (MV3) vs Firefox (MV2)
    if (browser === "chrome" || browser === "edge") {
      return {
        permissions: ["storage", "identity"],
        host_permissions: ["*://www.instagram.com/*"],
        optional_host_permissions: ["https://api.groundedmomentum.com/*"],
      };
    } else {
      // Firefox MV2
      return {
        permissions: ["storage", "identity", "*://www.instagram.com/*"],
        optional_permissions: ["https://api.groundedmomentum.com/*"],
      };
    }
  },
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  outDir: "dist",
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
