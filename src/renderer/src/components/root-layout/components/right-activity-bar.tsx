import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { rightActivityButtons } from "../constants/activity-buttons";
import { cn } from "@renderer/lib/utils";

interface RightActivityBarProps {
  rightActivePanel: string | null;
  onToggleRightSidebar: (panelId: string) => void;
  sessionsLength: number;
}

export function RightActivityBar({ rightActivePanel, onToggleRightSidebar, sessionsLength }: RightActivityBarProps) {
  return (
    <div className="bg-secondary/30 flex w-10 flex-col border-l">
      <div className="flex flex-1 flex-col items-center gap-1 py-2">
        {rightActivityButtons.map((button) => (
          <Tooltip key={button.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleRightSidebar(button.id)}
                className={cn(
                  "text-muted-foreground hover:bg-secondary hover:text-foreground relative h-8 w-8 transition-colors",
                  rightActivePanel === button.id && "bg-secondary text-foreground"
                )}
              >
                <button.icon className="h-5 w-5" />
                {/* 显示徽章（如未读消息数） */}
                {button.id === "chat" && sessionsLength > 0 && (
                  <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full text-[10px]">
                    {sessionsLength > 9 ? "9+" : sessionsLength}
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{button.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
