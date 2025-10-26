import { Editor } from "@tiptap/react";
import { Bold } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface BoldButtonProps {
  editor: Editor | null;
}

export function BoldButton({ editor }: BoldButtonProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={cn("h-8 w-8 p-0", editorState.isBold && "bg-secondary")}
        >
          <Bold className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>粗体 (Ctrl+B)</TooltipContent>
    </Tooltip>
  );
}
