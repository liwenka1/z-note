import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { AI_PLATFORMS, type AIPlatform } from "./constants/ai-platforms";
import { WebviewContainer } from "./components/webview-container";

export function AIPlaygroundPanel() {
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform | null>(null);

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
          </div>
        </div>

        {/* 平台列表 */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="space-y-2">
              {AI_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform)}
                  className="hover:bg-secondary/50 text-foreground flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{platform.name}</div>
                    {platform.description && (
                      <div className="text-muted-foreground mt-1 text-sm">{platform.description}</div>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">{platform.url}</div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
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
