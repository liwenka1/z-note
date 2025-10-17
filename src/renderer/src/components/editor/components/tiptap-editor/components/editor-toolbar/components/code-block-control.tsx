import { Editor } from "@tiptap/react";
import { Code2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface CodeBlockControlProps {
  editor: Editor | null;
}

export function CodeBlockControl({ editor }: CodeBlockControlProps) {
  // 使用官方推荐的 useEditorState hook 订阅编辑器状态
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCodeBlock}
          className={cn("h-8 w-8 p-0", editorState.isCodeBlock && "bg-secondary")}
        >
          <Code2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>代码块</TooltipContent>
    </Tooltip>
  );
}
