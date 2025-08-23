import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { ThemeToggleButton } from "@renderer/components/theme-toggle-button";
import { leftActivityButtons, leftBottomButtons } from "../constants/activity-buttons";
import { cn } from "@renderer/lib/utils";

interface LeftActivityBarProps {
  activePanel: string | null;
  onToggleLeftSidebar: (panelId: string) => void;
  onSettingsClick: () => void;
}

export function LeftActivityBar({ activePanel, onToggleLeftSidebar, onSettingsClick }: LeftActivityBarProps) {
  return (
    <div className="bg-secondary/30 flex h-full w-10 flex-col border-r">
      {/* 上半部分：主要功能按钮 */}
      <div className="flex flex-1 flex-col items-center gap-1 py-2">
        {leftActivityButtons.map((button) => (
          <Tooltip key={button.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleLeftSidebar(button.id)}
                className={cn(
                  "text-muted-foreground hover:bg-secondary hover:text-foreground h-8 w-8 transition-colors",
                  activePanel === button.id && "bg-secondary text-foreground"
                )}
              >
                <button.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{button.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* 下半部分：主题切换和设置 */}
      <div className="flex flex-col items-center gap-1 pb-2">
        <ThemeToggleButton />
        {leftBottomButtons.map((button) => (
          <Tooltip key={button.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground h-8 w-8 transition-colors"
              >
                <button.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{button.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
