import { Editor } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface TextAlignControlsProps {
  editor: Editor | null;
}

export function TextAlignControls({ editor }: TextAlignControlsProps) {
  if (!editor) {
    return null;
  }

  // 🚧 占位功能
  const handleAlign = (align: string) => {
    console.log(`${align}对齐功能即将推出`);
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign("左")}
            disabled
            className="h-8 w-8 p-0 opacity-50"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>左对齐 (即将推出)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign("居中")}
            disabled
            className="h-8 w-8 p-0 opacity-50"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>居中对齐 (即将推出)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign("右")}
            disabled
            className="h-8 w-8 p-0 opacity-50"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>右对齐 (即将推出)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign("两端")}
            disabled
            className="h-8 w-8 p-0 opacity-50"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>两端对齐 (即将推出)</TooltipContent>
      </Tooltip>
    </div>
  );
}
