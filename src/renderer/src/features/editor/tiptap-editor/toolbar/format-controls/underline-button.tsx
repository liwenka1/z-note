import { Editor } from "@tiptap/react";
import { Underline } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface UnderlineButtonProps {
  editor: Editor | null;
}

export function UnderlineButton({ editor }: UnderlineButtonProps) {
  if (!editor) {
    return null;
  }

  // 🚧 占位功能 - 暂未实现
  const handleClick = () => {
    console.log("下划线功能即将推出");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          disabled // 占位状态：禁用
          className="h-8 w-8 p-0 opacity-50"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>下划线 (即将推出)</TooltipContent>
    </Tooltip>
  );
}
