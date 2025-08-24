import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export function HelpButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-secondary/50 h-5 w-5 p-0">
          <HelpCircle className="h-3 w-3" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>帮助</p>
      </TooltipContent>
    </Tooltip>
  );
}
