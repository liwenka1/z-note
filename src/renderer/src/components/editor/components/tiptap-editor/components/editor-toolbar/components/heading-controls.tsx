import { Editor } from "@tiptap/react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";

interface HeadingControlsProps {
  editor: Editor;
}

export function HeadingControls({ editor }: HeadingControlsProps) {
  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <Tooltip key={level}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHeading(level as 1 | 2 | 3 | 4 | 5 | 6)}
              className={cn("h-8 px-2", "text-xs font-medium", editor.isActive("heading", { level }) && "bg-secondary")}
            >
              H{level}
            </Button>
          </TooltipTrigger>
          <TooltipContent>标题 {level}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
