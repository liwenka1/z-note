import { Editor } from "@tiptap/react";
import { Link2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";

interface LinkButtonProps {
  editor: Editor | null;
}

export function LinkButton({ editor }: LinkButtonProps) {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    editor.chain().focus();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-secondary")}
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>链接</TooltipContent>
    </Tooltip>
  );
}
