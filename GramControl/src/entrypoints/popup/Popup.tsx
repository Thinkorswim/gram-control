import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import './style.css';
import '~/assets/global.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Settings } from '../models/Settings';
import { Button } from '@/components/ui/button';

function Popup() {
  const [settings, setSettings] = useState<Settings>(new Settings());

  // Load the settings from storage on component mount
  useEffect(() => {
    if (typeof browser !== 'undefined' && browser.storage) {
      browser.storage.local.get(['settings'], (result) => {
        if (result.settings) {
          setSettings(Settings.fromJSON(result.settings));
        } else {
          // Initialize default settings if they don't exist
          const defaultSettings = new Settings();
          setSettings(defaultSettings);
          browser.storage.local.set({ settings: defaultSettings.toJSON() });
        }
      });
    }
  }, []);

  // Handle settings switch toggle
  const handleSettingChange = (setting: keyof Settings, checked: boolean) => {
    const updatedSettings = new Settings(
      setting === 'recommendationsDisabled' ? checked : settings.recommendationsDisabled,
      setting === 'explorePageDisabled' ? checked : settings.explorePageDisabled,
      setting === 'reelsPageDisabled' ? checked : settings.reelsPageDisabled,
      setting === 'suggestedFriendsDisabled' ? checked : settings.suggestedFriendsDisabled,
      setting === 'commentsDisabled' ? checked : settings.commentsDisabled
    );

    setSettings(updatedSettings);

    browser.storage.local.set({ settings: updatedSettings.toJSON() });

  };

  document.body.classList.add('w-[300px]')
  document.body.classList.add('bg-white')

  return (
    <div className='w-full font-geist bg-white'>
      <div className='mb-4 py-2.5 flex items-center px-5 bg-muted/50 rounded-b-2xl'>
        <div
          className='h-full w-full flex items-center justify-start'
        >
          <img src="/images/logo-256.png" alt="Logo" className="w-5 h-5 mb-0.5" />
          <div className='text-primary ml-2 font-black text-lg'>
            Instagram Control
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Recommendations Setting */}
        <div className={`flex items-center justify-between max-w-[300px]`}>
          <div className="flex items-center">
            <Label className='text-sm' htmlFor="recommendationsDisabled">Disable Recommendations</Label>
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
            className='data-[state=unchecked]:bg-white'
            checked={settings.recommendationsDisabled}
            onCheckedChange={(checked) => handleSettingChange('recommendationsDisabled', checked)}
          />
        </div>

        {/* Explore Page Setting */}
        <div className={`flex items-center justify-between max-w-[300px]`}>
          <div className="flex items-center">
            <Label className='text-sm' htmlFor="explorePageDisabled">Disable Explore Page</Label>
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
            className='data-[state=unchecked]:bg-white'
            checked={settings.explorePageDisabled}
            onCheckedChange={(checked) => handleSettingChange('explorePageDisabled', checked)}
          />
        </div>

        {/* Reels Page Setting */}
        <div className={`flex items-center justify-between max-w-[300px]`}>
          <div className="flex items-center">
            <Label className='text-sm' htmlFor="reelsPageDisabled">Disable Reels Page</Label>
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
            className='data-[state=unchecked]:bg-white'
            checked={settings.reelsPageDisabled}
            onCheckedChange={(checked) => handleSettingChange('reelsPageDisabled', checked)}
          />
        </div>

        {/* Suggested Friends Setting */}
        <div className={`flex items-center justify-between max-w-[300px]`}>
          <div className="flex items-center">
            <Label className='text-sm' htmlFor="suggestedFriendsDisabled">Disable Suggested Friends</Label>
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
            className='data-[state=unchecked]:bg-white'
            checked={settings.suggestedFriendsDisabled}
            onCheckedChange={(checked) => handleSettingChange('suggestedFriendsDisabled', checked)}
          />
        </div>

        {/* Comments Setting */}
        <div className={`flex items-center justify-between max-w-[300px]`}>
          <div className="flex items-center">
            <Label className='text-sm' htmlFor="commentsDisabled">Disable Comments</Label>
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
            className='data-[state=unchecked]:bg-white'
            checked={settings.commentsDisabled}
            onCheckedChange={(checked) => handleSettingChange('commentsDisabled', checked)}
          />
        </div>
      </div>


      <div className="bg-muted/50 rounded-3xl py-2 px-3 mx-1 mt-4 mb-2 ">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <a
            href="https://groundedmomentum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary font-semibold"
          >
            <img src="/images/gm_logo_pink.svg" alt="Grounded Momentum Logo" className="w-5 h-5 mr-1" />
            groundedmomentum.com
          </a>
          <div className="flex items-center text-secondary font-semibold">
            <div className='flex items-center'>
              <Button className="rounded-lg px-2 bg-primary hover:bg-primary/70" onClick={() => { window.open("https://discord.gg/SvTsqKwsgN", "_blank") }}>  <img height="16" width="16" className=" color-white" src="https://cdn.simpleicons.org/discord/ffffff" /> Discord </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup;
