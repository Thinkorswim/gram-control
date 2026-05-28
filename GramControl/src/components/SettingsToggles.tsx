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
import { t, useLocale } from "@/lib/i18n";

type SettingKey = keyof ReturnType<Settings["toJSON"]>;

const ROW_KEYS: { key: SettingKey; i18nGroup: string }[] = [
  { key: "recommendationsDisabled", i18nGroup: "recommendations" },
  { key: "explorePageDisabled", i18nGroup: "explore" },
  { key: "reelsPageDisabled", i18nGroup: "reels" },
  { key: "suggestedFriendsDisabled", i18nGroup: "suggestedFriends" },
  { key: "commentsDisabled", i18nGroup: "comments" },
  { key: "hideStoriesOnMainPage", i18nGroup: "hideStories" },
];

interface SettingsTogglesProps {
  settings: Settings;
  onChange: (next: Settings) => void;
}

export function SettingsToggles({ settings, onChange }: SettingsTogglesProps) {
  useLocale();
  const values = settings.toJSON();

  const handleChange = (key: SettingKey, checked: boolean) => {
    onChange(Settings.fromJSON({ ...values, [key]: checked }));
  };

  return (
    <div className="space-y-4">
      {ROW_KEYS.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between max-w-[300px]"
        >
          <div className="text-sm pr-2">
            <Label className="inline" htmlFor={row.key}>
              {t(`toggles.${row.i18nGroup}.label` as Parameters<typeof t>[0])}
            </Label>{" "}
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center justify-center align-middle rounded-full">
                    <Info className="w-4 h-4 text-primary/30" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-white p-2 rounded max-w-[280px] ![text-wrap:pretty]">
                  {t(`toggles.${row.i18nGroup}.tooltip` as Parameters<typeof t>[0])}
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
