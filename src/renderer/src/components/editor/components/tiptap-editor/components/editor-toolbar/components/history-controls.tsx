import { Editor } from "@tiptap/react";
import { Undo, Redo } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface HistoryControlsProps {
  editor: Editor;
}

export function HistoryControls({ editor }: HistoryControlsProps) {
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={undo} disabled={!editor.can().undo()} className="h-8 w-8 p-0">
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>撤销 (Ctrl+Z)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!editor.can().redo()} className="h-8 w-8 p-0">
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>重做 (Ctrl+Y)</TooltipContent>
      </Tooltip>
    </div>
  );
}
