import { Editor } from "@tiptap/react";
import { Minus, WrapText, Eraser } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface ExtraControlsProps {
  editor: Editor | null;
}

/**
 * 额外的编辑器控件
 * 包含：水平线、硬换行、清除格式
 */
export function ExtraControls({ editor }: ExtraControlsProps) {
  if (!editor) {
    return null;
  }

  const insertHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();
  const insertHardBreak = () => editor.chain().focus().setHardBreak().run();
  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div className="flex items-center gap-1">
      {/* 水平分割线 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={insertHorizontalRule} className="h-8 w-8 p-0">
            <Minus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>插入水平线</TooltipContent>
      </Tooltip>

      {/* 硬换行 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={insertHardBreak} className="h-8 w-8 p-0">
            <WrapText className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>硬换行 (Shift+Enter)</TooltipContent>
      </Tooltip>

      {/* 清除格式 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={clearFormatting} className="h-8 w-8 p-0">
            <Eraser className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>清除格式</TooltipContent>
      </Tooltip>
    </div>
  );
}
