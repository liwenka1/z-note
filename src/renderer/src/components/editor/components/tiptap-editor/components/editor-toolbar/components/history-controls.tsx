import { Editor } from "@tiptap/react";
import { Undo, Redo } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface HistoryControlsProps {
  editor: Editor | null;
}

export function HistoryControls({ editor }: HistoryControlsProps) {
  // 使用官方推荐的 useEditorState hook 订阅编辑器状态
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={undo} disabled={!editorState.canUndo} className="h-8 w-8 p-0">
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>撤销 (Ctrl+Z)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={redo} disabled={!editorState.canRedo} className="h-8 w-8 p-0">
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>重做 (Ctrl+Y)</TooltipContent>
      </Tooltip>
    </div>
  );
}
