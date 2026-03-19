import { useState, useEffect } from "react";
import "./style.css";
import "~/assets/global.css";
import { Dot, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GMPlus } from "./GMPlus";

function Options() {
  const [ctaDiscordText, setCtaDiscordText] = useState<string>("");

  const selectCallToAction = () => {
    const ctaDiscordTexts: string[] = [
      "Have a question? Join the",
      "Need help? Join the",
      "Have a suggestion? Join the",
      "Want to chat? Join the",
      "Like productivity? Join the",
      "Have feedback? Join the",
    ];

    const randomIndex = Math.floor(Math.random() * ctaDiscordTexts.length);
    setCtaDiscordText(ctaDiscordTexts[randomIndex]);
  };

  useEffect(() => {
    selectCallToAction();
  }, []);

  return (
    <>
      <div className="px-10 flex flex-col min-h-screen max-w-screen-lg mx-auto font-geist">
        <div className="flex-grow">
          <Tabs defaultValue="pro">
            <div className="mt-8 mb-10 flex items-center">
              <img
                src="/images/logo-256.png"
                alt="Logo"
                className="w-10 h-10 mr-4"
              />

              <TabsList className="py-5 px-2">
                <TabsTrigger
                  className="data-[state=active]:shadow-none"
                  value="pro"
                >
                  <Sparkles className="w-4 h-4 mr-1" /> GM Plus
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pro">
              <GMPlus />
            </TabsContent>
          </Tabs>
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
    </>
  );
}

export default Options;
