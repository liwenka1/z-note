import { Editor } from "@tiptap/react";
import { Quote } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface BlockquoteButtonProps {
  editor: Editor | null;
}

export function BlockquoteButton({ editor }: BlockquoteButtonProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBlockquote}
          className={cn("h-8 w-8 p-0", editorState.isBlockquote && "bg-secondary")}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>引用</TooltipContent>
    </Tooltip>
  );
}
