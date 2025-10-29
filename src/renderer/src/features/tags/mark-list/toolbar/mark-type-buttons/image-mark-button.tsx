import { useState } from "react";
import { Image } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { ImageMarkDialog } from "../../create-dialogs/image-mark-dialog";

interface ImageMarkButtonProps {
  tagId: number;
}

export function ImageMarkButton({ tagId }: ImageMarkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0">
            <Image className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>添加图片记录</TooltipContent>
      </Tooltip>

      <ImageMarkDialog open={open} onOpenChange={setOpen} tagId={tagId} />
    </>
  );
}
