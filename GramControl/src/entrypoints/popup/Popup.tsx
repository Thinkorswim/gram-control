import { useState, useEffect } from "react";
import "./style.css";
import "~/assets/global.css";
import { AlertCircle } from "lucide-react";
import { Settings } from "../models/Settings";
import { Button } from "@/components/ui/button";
import { SettingsToggles } from "@/components/SettingsToggles";
import { loadSettings, saveSettings } from "@/lib/settings";

function Popup() {
  const [settings, setSettings] = useState<Settings>(new Settings());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCurrentSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadedSettings = await loadSettings();
        setSettings(loadedSettings.settings);
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
      setIsSaving(true);
      await saveSettings(updatedSettings);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  document.body.classList.add("w-[300px]");
  document.body.classList.add("bg-white");

  return (
    <div className="w-full font-geist bg-white">
      <div className="mb-4 py-2.5 flex items-center px-3 bg-muted/50 rounded-b-2xl">
        <div className="h-full w-full flex items-center ">
          <img
            src="/images/logo-256.png"
            alt="Logo"
            className="w-5 h-5 mb-0.5"
          />
          <div className="text-primary w-full ml-2 font-black text-base">
            Instagram Control
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          {isSaving && (
            <div className="mr-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="px-5 py-8 flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Loading settings...</p>
        </div>
      )}

      {/* Settings Content - Only show when not loading */}
      {!isLoading && (
        <div className="px-5">
          <SettingsToggles settings={settings} onChange={handleSettingsChange} />
        </div>
      )}

      <div className="bg-muted/50 rounded-3xl py-2 px-3 mx-1 mt-4 mb-2 ">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <a
            href="https://groundedmomentum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary font-semibold"
          >
            <img
              src="/images/gm_logo_pink.svg"
              alt="Grounded Momentum Logo"
              className="w-5 h-5 mr-1"
            />
            groundedmomentum.com
          </a>
          <div className="flex items-center text-secondary font-semibold">
            <div className="flex items-center">
              <Button
                className="rounded-lg px-2 bg-primary hover:bg-primary/70"
                onClick={() => {
                  window.open("https://discord.gg/SvTsqKwsgN", "_blank");
                }}
              >
                {" "}
                <img
                  height="16"
                  width="16"
                  className=" color-white"
                  src="https://cdn.simpleicons.org/discord/ffffff"
                />{" "}
                Discord{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;
