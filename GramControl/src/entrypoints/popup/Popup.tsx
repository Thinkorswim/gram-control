import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import "./style.css";
import "~/assets/global.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Cog,
  Info,
  AlertCircle,
  RefreshCw,
  Sparkle,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Settings } from "../models/Settings";
import { User } from "../models/User";
import { Button } from "@/components/ui/button";
import { loadSettings, saveSettings } from "@/lib/settings";

function Popup() {
  const [settings, setSettings] = useState<Settings>(new Settings());
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [extensionsPlusUser, setIsProUser] = useState(false);

  useEffect(() => {
    const loadCurrentSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadedSettings = await loadSettings();

        console.log("Loaded settings:", loadedSettings);

        setSettings(loadedSettings.settings);
        setUser(loadedSettings.user);
        setIsProUser(
          loadedSettings.user !== undefined && loadedSettings.user.extensionsPlus
        );
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentSettings();
  }, []);

  const handleSettingChange = async (
    setting: keyof Settings,
    checked: boolean
  ) => {
    const updatedSettings = new Settings(
      setting === "recommendationsDisabled"
        ? checked
        : settings.recommendationsDisabled,
      setting === "explorePageDisabled"
        ? checked
        : settings.explorePageDisabled,
      setting === "reelsPageDisabled" ? checked : settings.reelsPageDisabled,
      setting === "suggestedFriendsDisabled"
        ? checked
        : settings.suggestedFriendsDisabled,
      setting === "commentsDisabled" ? checked : settings.commentsDisabled
    );

    setSettings(updatedSettings);
    setError(null);

    try {
      setIsSaving(true);
      await saveSettings(updatedSettings, user);

    } catch (err) {
      const errorMsg = "Failed to save settings. Please try again.";
      setError(errorMsg);
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
          {extensionsPlusUser ? (
            <span
              onClick={() => {
                const url = browser.runtime.getURL('/options.html');
                browser.tabs.create({ url });
              }}
              className="mr-1 cursor-pointer w-22 px-1 text-center bg-gradient-to-r from-chart-1 to-chart-2 py-0.5 text-xs  text-white border-primary/50 rounded-full font-semibold flex items-center justify-center transition-all duration-100 hover:scale-105"
            >
              <Sparkles className="inline-block w-3 h-3 mr-1" />
              Plus
            </span>
          ) : (
            <span
              onClick={() => {
                const url = browser.runtime.getURL('/options.html');
                browser.tabs.create({ url });
              }}
              className="mr-1 cursor-pointer w-34 px-1 text-center bg-gradient-to-r from-chart-1 to-chart-2 py-0.5 text-xs  text-white border-primary/50 rounded-full font-semibold flex items-center justify-center transition-all duration-100 hover:scale-105"
            >
              <Sparkles className="inline-block w-3 h-3 mr-1" />
              Get Plus
            </span>
          )}
          {/* {extensionsPlusUser ? (
            <span className="mr-1 px-1 text-center py-0.5 w-22 text-xs bg-gradient-to-r from-[#e496be] to-[#E6067A] text-white rounded-full font-semibold">
              <Sparkles className="inline-block w-3 h-3 mr-1" />
              Plus
            </span>
          ) : (
            <span
              onClick={() => browser.runtime.openOptionsPage()}
              className="cursor-pointer w-34 px-1 text-center py-0.5 text-xs border  text-primary rounded-full font-semibold "
            >
              <Sparkles className="inline-block w-3 h-3 mr-1" />
              Get Plus
            </span>
          )} */}
        </div>

        <div className="flex items-center justify-end space-x-2">
          {isSaving && (
            <div className="mr-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}

          {extensionsPlusUser && !isSaving && (
            <Cog
              className="w-5 h-5 text-chart-1 cursor-pointer"
              onClick={() => browser.runtime.openOptionsPage()}
            />
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
        <div className="px-5 space-y-4">
          {/* Recommendations Setting */}
          <div className={`flex items-center justify-between max-w-[300px]`}>
            <div className="flex items-center">
              <Label className="text-sm" htmlFor="recommendationsDisabled">
                Disable Recommendations
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center ml-2 rounded-full">
                      <Info className="w-4 h-4 text-primary/30" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white p-2 rounded">
                    Hide recommendation posts from your feed
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="recommendationsDisabled"
              className="data-[state=unchecked]:bg-white"
              checked={settings.recommendationsDisabled}
              onCheckedChange={(checked) =>
                handleSettingChange("recommendationsDisabled", checked)
              }
            />
          </div>

          {/* Explore Page Setting */}
          <div className={`flex items-center justify-between max-w-[300px]`}>
            <div className="flex items-center">
              <Label className="text-sm" htmlFor="explorePageDisabled">
                Disable Explore Page
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center ml-2 rounded-full">
                      <Info className="w-4 h-4 text-primary/30" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white p-2 rounded">
                    Disable access the Explore page
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="explorePageDisabled"
              className="data-[state=unchecked]:bg-white"
              checked={settings.explorePageDisabled}
              onCheckedChange={(checked) =>
                handleSettingChange("explorePageDisabled", checked)
              }
            />
          </div>

          {/* Reels Page Setting */}
          <div className={`flex items-center justify-between max-w-[300px]`}>
            <div className="flex items-center">
              <Label className="text-sm" htmlFor="reelsPageDisabled">
                Disable Reels Page
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center ml-2 rounded-full">
                      <Info className="w-4 h-4 text-primary/30" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white p-2 rounded">
                    Disable access the Reels page
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="reelsPageDisabled"
              className="data-[state=unchecked]:bg-white"
              checked={settings.reelsPageDisabled}
              onCheckedChange={(checked) =>
                handleSettingChange("reelsPageDisabled", checked)
              }
            />
          </div>

          {/* Suggested Friends Setting */}
          <div className={`flex items-center justify-between max-w-[300px]`}>
            <div className="flex items-center">
              <Label className="text-sm" htmlFor="suggestedFriendsDisabled">
                Disable Suggested Friends
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center ml-2 rounded-full">
                      <Info className="w-4 h-4 text-primary/30" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white p-2 rounded">
                    Hide suggested friends sections
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="suggestedFriendsDisabled"
              className="data-[state=unchecked]:bg-white"
              checked={settings.suggestedFriendsDisabled}
              onCheckedChange={(checked) =>
                handleSettingChange("suggestedFriendsDisabled", checked)
              }
            />
          </div>

          {/* Comments Setting */}
          <div className={`flex items-center justify-between max-w-[300px]`}>
            <div className="flex items-center">
              <Label className="text-sm" htmlFor="commentsDisabled">
                Disable Comments
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center ml-2 rounded-full">
                      <Info className="w-4 h-4 text-primary/30" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-white p-2 rounded">
                    Hide comment sections on posts
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="commentsDisabled"
              className="data-[state=unchecked]:bg-white"
              checked={settings.commentsDisabled}
              onCheckedChange={(checked) =>
                handleSettingChange("commentsDisabled", checked)
              }
            />
          </div>
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
