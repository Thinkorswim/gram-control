import { useState, useEffect } from "react";
import "./style.css";
import "~/assets/global.css";
import { AlertCircle, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Settings } from "../models/Settings";
import { SettingsToggles } from "@/components/SettingsToggles";
import { loadSettings, saveSettings } from "@/lib/settings";

function Options() {
  const [settings, setSettings] = useState<Settings>(new Settings());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ctaDiscordText, setCtaDiscordText] = useState<string>("");

  const version = browser.runtime.getManifest().version;

  useEffect(() => {
    const ctaDiscordTexts: string[] = [
      "Have a question? Join the",
      "Need help? Join the",
      "Have a suggestion? Join the",
      "Want to chat? Join the",
      "Like productivity? Join the",
      "Have feedback? Join the",
    ];
    setCtaDiscordText(
      ctaDiscordTexts[Math.floor(Math.random() * ctaDiscordTexts.length)]
    );

    const loadCurrentSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loaded = await loadSettings();
        setSettings(loaded.settings);
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentSettings();
  }, []);

  const handleSettingsChange = async (updatedSettings: Settings) => {
    setSettings(updatedSettings);
    setError(null);
    try {
      await saveSettings(updatedSettings);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="px-10 flex flex-col min-h-screen max-w-screen-lg mx-auto font-geist">
      <div className="flex-grow">
        <div className="mt-8 mb-10 flex items-center">
          <img
            src="/images/logo-256.png"
            alt="Logo"
            className="w-10 h-10 mr-4"
          />
          <h1 className="text-xl font-black text-primary">Instagram Control</h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 max-w-md">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Settings */}
        <section className="bg-muted/50 rounded-2xl p-6 max-w-md">
          <h2 className="text-base font-bold mb-1">Settings</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Your settings sync automatically across devices where you're signed
            into your browser.
          </p>
          {isLoading ? (
            <div className="py-6 flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-gray-600">Loading settings...</p>
            </div>
          ) : (
            <SettingsToggles settings={settings} onChange={handleSettingsChange} />
          )}
        </section>

        {/* About */}
        <section className="bg-muted/50 rounded-2xl p-6 max-w-md mt-6">
          <h2 className="text-base font-bold mb-3">About</h2>
          <div className="flex items-center mb-3">
            <img
              src="/images/logo-256.png"
              alt="Logo"
              className="w-8 h-8 mr-3"
            />
            <div>
              <div className="text-sm font-semibold">Instagram Control</div>
              <div className="text-xs text-muted-foreground">
                Version {version} &middot; Free &amp; ad-free
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://groundedmomentum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold"
            >
              groundedmomentum.com
            </a>
            <a
              href="https://discord.gg/SvTsqKwsgN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold"
            >
              Discord community
            </a>
          </div>
        </section>
      </div>

      <footer className="bg-muted rounded-t-lg py-5 px-8 mt-10">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <a
            href="https://groundedmomentum.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-muted-foreground font-semibold transition-colors"
          >
            <img
              src="/images/gm_logo_pink.svg"
              alt="Grounded Momentum Logo"
              className="w-6 h-6 mr-2"
            />{" "}
            Grounded Momentum <Dot className="w-2 h-2 mx-1" /> 2026
          </a>
          <div className="flex items-center text-muted-foreground font-semibold">
            {ctaDiscordText}
            <div className="flex items-center">
              <Button
                className="ml-3 rounded-lg"
                onClick={() => {
                  window.open("https://discord.gg/SvTsqKwsgN", "_blank");
                }}
              >
                {" "}
                <img
                  height="20"
                  width="20"
                  className=" color-white"
                  src="https://cdn.simpleicons.org/discord/ffffff"
                />{" "}
                Discord{" "}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Options;
