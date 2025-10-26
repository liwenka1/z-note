import { Editor } from "@tiptap/react";
import { Superscript, Subscript } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";

interface TextScriptControlsProps {
  editor: Editor | null;
}

export function TextScriptControls({ editor }: TextScriptControlsProps) {
  if (!editor) {
    return null;
  }

  // 🚧 占位功能
  const handleSuperscript = () => console.log("上标功能即将推出");
  const handleSubscript = () => console.log("下标功能即将推出");

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleSuperscript} disabled className="h-8 w-8 p-0 opacity-50">
            <Superscript className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>上标 (即将推出)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleSubscript} disabled className="h-8 w-8 p-0 opacity-50">
            <Subscript className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>下标 (即将推出)</TooltipContent>
      </Tooltip>
    </div>
  );
}
