import { Editor } from "@tiptap/react";
import { Italic } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface ItalicButtonProps {
  editor: Editor | null;
}

export function ItalicButton({ editor }: ItalicButtonProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleItalic = () => editor.chain().focus().toggleItalic().run();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={cn("h-8 w-8 p-0", editorState.isItalic && "bg-secondary")}
        >
          <Italic className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>斜体 (Ctrl+I)</TooltipContent>
    </Tooltip>
  );
}
