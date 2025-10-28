import { Editor } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../hooks/use-editor-active-state";

interface TextAlignControlsProps {
  editor: Editor | null;
}

export function TextAlignControls({ editor }: TextAlignControlsProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const setAlign = (alignment: "left" | "center" | "right" | "justify") => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAlign("left")}
            className={cn("h-8 w-8 p-0", editorState.isAlignLeft && "bg-secondary")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>左对齐 (Ctrl+Shift+L)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAlign("center")}
            className={cn("h-8 w-8 p-0", editorState.isAlignCenter && "bg-secondary")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>居中对齐 (Ctrl+Shift+E)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAlign("right")}
            className={cn("h-8 w-8 p-0", editorState.isAlignRight && "bg-secondary")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>右对齐 (Ctrl+Shift+R)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAlign("justify")}
            className={cn("h-8 w-8 p-0", editorState.isAlignJustify && "bg-secondary")}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>两端对齐 (Ctrl+Shift+J)</TooltipContent>
      </Tooltip>
    </div>
  );
}
