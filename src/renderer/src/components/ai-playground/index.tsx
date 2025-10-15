import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { AI_PLATFORMS, type AIPlatform } from "./constants/ai-platforms";
import { WebviewContainer } from "./components/webview-container";
import { AddPlatformDialog } from "./components/add-platform-dialog";
import { PlatformCard } from "./components/platform-card";
import { useAIPlatformsStore } from "@renderer/stores";

export function AIPlaygroundPanel() {
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform | null>(null);
  const customPlatforms = useAIPlatformsStore((state) => state.customPlatforms);

  // 关闭 webview
  const handleClose = () => {
    setSelectedPlatform(null);
  };

  // 如果没有选择平台，显示列表
  if (!selectedPlatform) {
    return (
      <div className="bg-background flex h-full flex-col">
        {/* Header */}
        <div className="border-border/50 bg-secondary/30 border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-foreground text-sm font-medium">AI 工作台</h2>
            <AddPlatformDialog />
          </div>
        </div>

        {/* 平台列表 */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
              {/* 默认平台 */}
              {AI_PLATFORMS.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} onSelect={setSelectedPlatform} isCustom={false} />
              ))}

              {/* 自定义平台 */}
              {customPlatforms.length > 0 && (
                <>
                  {customPlatforms.map((platform) => (
                    <PlatformCard
                      key={platform.id}
                      platform={platform}
                      onSelect={setSelectedPlatform}
                      isCustom={true}
                    />
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // 显示 webview
  return (
    <div className="bg-background flex h-full flex-col">
      {/* Header with close button */}
      <div className="border-border/50 bg-secondary/30 border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-foreground text-sm font-medium">{selectedPlatform.name}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Webview */}
      <div className="flex-1 overflow-hidden">
        <WebviewContainer platform={selectedPlatform} />
      </div>
    </div>
  );
}
