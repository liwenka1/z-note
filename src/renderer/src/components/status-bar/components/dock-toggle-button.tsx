import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { PanelLeftClose } from "lucide-react";

interface DockToggleButtonProps {
  onToggleDock?: () => void;
  isDockVisible?: boolean;
}

export function DockToggleButton({ onToggleDock, isDockVisible = false }: DockToggleButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={onToggleDock} className="hover:bg-secondary/50 h-5 w-5 p-0">
          <PanelLeftClose className={`h-3 w-3 transition-transform ${isDockVisible ? "" : "rotate-180"}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>显示/隐藏停靠栏</p>
      </TooltipContent>
    </Tooltip>
  );
}
