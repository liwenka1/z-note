import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Code } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../hooks/use-editor-active-state";

interface FormatControlsProps {
  editor: Editor | null;
}

export function FormatControls({ editor }: FormatControlsProps) {
  // 使用官方推荐的 useEditorState hook 订阅编辑器状态
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();

  return (
    <div className="flex items-center gap-1">
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

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleStrike}
            className={cn("h-8 w-8 p-0", editorState.isStrike && "bg-secondary")}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>删除线</TooltipContent>
      </Tooltip>

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
    </div>
  );
}
