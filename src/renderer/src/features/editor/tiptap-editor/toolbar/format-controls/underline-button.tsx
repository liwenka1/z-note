import { Editor } from "@tiptap/react";
import { Underline } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface UnderlineButtonProps {
  editor: Editor | null;
}

export function UnderlineButton({ editor }: UnderlineButtonProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleUnderline}
          className={cn("h-8 w-8 p-0", editorState.isUnderline && "bg-secondary")}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>下划线 (Ctrl+U)</TooltipContent>
    </Tooltip>
  );
}
