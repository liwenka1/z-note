import { Editor } from "@tiptap/react";
import { ImagePlus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface MediaControlsProps {
  editor: Editor | null;
}

export function MediaControls({ editor }: MediaControlsProps) {
  if (!editor) {
    return null;
  }

  // 🚧 占位功能
  const handleImageUpload = () => {
    console.log("图片上传功能即将推出");
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            disabled
            className="h-8 w-max gap-1 px-2 opacity-50"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="text-xs">添加图片</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>图片上传 (即将推出)</TooltipContent>
      </Tooltip>
    </div>
  );
}
