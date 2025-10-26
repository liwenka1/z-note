import { Editor } from "@tiptap/react";
import { Highlighter } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface HighlightDropdownProps {
  editor: Editor | null;
}

export function HighlightDropdown({ editor }: HighlightDropdownProps) {
  if (!editor) {
    return null;
  }

  // 🚧 占位功能 - 暂未实现
  const handleClick = () => {
    console.log("高亮功能即将推出");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={handleClick} disabled className="h-8 w-8 p-0 opacity-50">
          <Highlighter className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>高亮颜色 (即将推出)</TooltipContent>
    </Tooltip>
  );
}
