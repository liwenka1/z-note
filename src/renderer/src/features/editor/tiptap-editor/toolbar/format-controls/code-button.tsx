import { Editor } from "@tiptap/react";
import { Code } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface CodeButtonProps {
  editor: Editor | null;
}

export function CodeButton({ editor }: CodeButtonProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleCode = () => editor.chain().focus().toggleCode().run();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCode}
          className={cn("h-8 w-8 p-0", editorState.isCode && "bg-secondary")}
        >
          <Code className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>行内代码</TooltipContent>
    </Tooltip>
  );
}
