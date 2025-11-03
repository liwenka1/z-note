import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { rightActivityButtons } from "../constants/activity-buttons";
import { cn } from "@renderer/lib/utils";

interface RightActivityBarProps {
  rightActivePanel: string | null;
  onToggleRightSidebar: (panelId: string) => void;
}

export function RightActivityBar({ rightActivePanel, onToggleRightSidebar }: RightActivityBarProps) {
  return (
    <div className="bg-secondary/30 flex h-full w-10 flex-col">
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
