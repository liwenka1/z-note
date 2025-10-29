import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { TextMarkDialog } from "../../create-dialogs/text-mark-dialog";

interface TextMarkButtonProps {
  tagId: number;
}

export function TextMarkButton({ tagId }: TextMarkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0">
            <FileText className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>添加文本记录</TooltipContent>
      </Tooltip>

      <TextMarkDialog open={open} onOpenChange={setOpen} tagId={tagId} />
    </>
  );
}
