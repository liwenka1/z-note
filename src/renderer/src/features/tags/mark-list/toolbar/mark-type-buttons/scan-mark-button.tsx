import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { ScanMarkDialog } from "../../create-dialogs/scan-mark-dialog";

interface ScanMarkButtonProps {
  tagId: number;
}

export function ScanMarkButton({ tagId }: ScanMarkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0">
            <ScanLine className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>添加扫描记录</TooltipContent>
      </Tooltip>

      <ScanMarkDialog open={open} onOpenChange={setOpen} tagId={tagId} />
    </>
  );
}
