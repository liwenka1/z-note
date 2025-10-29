import { useState } from "react";
import { File } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { FileMarkDialog } from "../../create-dialogs/file-mark-dialog";

interface FileMarkButtonProps {
  tagId: number;
}

export function FileMarkButton({ tagId }: FileMarkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0">
            <File className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>添加文件记录</TooltipContent>
      </Tooltip>

      <FileMarkDialog open={open} onOpenChange={setOpen} tagId={tagId} />
    </>
  );
}
