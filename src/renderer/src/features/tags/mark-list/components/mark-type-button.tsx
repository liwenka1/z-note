import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { MARK_TYPE_CONFIG } from "../constants";
import type { MarkFormData } from "@shared/types";

interface MarkTypeButtonProps {
  type: MarkFormData["type"];
  tagId: number;
  DialogComponent: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tagId: number;
  }>;
}

export function MarkTypeButton({ type, tagId, DialogComponent }: MarkTypeButtonProps) {
  const [open, setOpen] = useState(false);
  const config = MARK_TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0">
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{config.createLabel}</TooltipContent>
      </Tooltip>

      <DialogComponent open={open} onOpenChange={setOpen} tagId={tagId} />
    </>
  );
}
