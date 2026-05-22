import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Settings } from "../entrypoints/models/Settings";

type SettingKey = keyof ReturnType<Settings["toJSON"]>;

const ROWS: { key: SettingKey; label: string; tooltip: string }[] = [
  {
    key: "recommendationsDisabled",
    label: "Disable Recommendations",
    tooltip: "Hide recommendation posts from your feed",
  },
  {
    key: "explorePageDisabled",
    label: "Disable Explore Page",
    tooltip: "Disable access the Explore page",
  },
  {
    key: "reelsPageDisabled",
    label: "Disable Reels Page",
    tooltip: "Disable access the Reels page",
  },
  {
    key: "suggestedFriendsDisabled",
    label: "Disable Suggested Friends",
    tooltip: "Hide suggested friends sections",
  },
  {
    key: "commentsDisabled",
    label: "Disable Comments",
    tooltip: "Hide comment sections on posts",
  },
  {
    key: "hideStoriesOnMainPage",
    label: "Hide Stories from Main Page",
    tooltip: "Hide the stories tray from the main feed",
  },
];

interface SettingsTogglesProps {
  settings: Settings;
  onChange: (next: Settings) => void;
}

export function SettingsToggles({ settings, onChange }: SettingsTogglesProps) {
  const values = settings.toJSON();

  const handleChange = (key: SettingKey, checked: boolean) => {
    onChange(Settings.fromJSON({ ...values, [key]: checked }));
  };

  return (
    <div className="space-y-4">
      {ROWS.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between max-w-[300px]"
        >
          <div className="flex items-center">
            <Label className="text-sm" htmlFor={row.key}>
              {row.label}
            </Label>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button className="flex items-center justify-center ml-2 rounded-full">
                    <Info className="w-4 h-4 text-primary/30" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-white p-2 rounded">
                  {row.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id={row.key}
            className="data-[state=unchecked]:bg-white"
            checked={values[row.key]}
            onCheckedChange={(checked) => handleChange(row.key, checked)}
          />
        </div>
      ))}
    </div>
  );
}
