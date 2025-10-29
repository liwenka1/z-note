import { useState } from "react";
import { Link } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { LinkMarkDialog } from "../../create-dialogs/link-mark-dialog";

interface LinkMarkButtonProps {
  tagId: number;
}

export function LinkMarkButton({ tagId }: LinkMarkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 w-8 p-0">
            <Link className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>添加链接记录</TooltipContent>
      </Tooltip>

      <LinkMarkDialog open={open} onOpenChange={setOpen} tagId={tagId} />
    </>
  );
}
