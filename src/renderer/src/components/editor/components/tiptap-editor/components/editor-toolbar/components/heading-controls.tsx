import { Editor } from "@tiptap/react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@renderer/lib/utils";

interface HeadingControlsProps {
  editor: Editor;
}

const levels = [1, 2, 3, 4] as const;

export function HeadingControls({ editor }: HeadingControlsProps) {
  // 获取当前激活的标题级别
  const activeLevel = levels.find((level) => editor.isActive("heading", { level }));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 w-max gap-1 px-3 font-normal", editor.isActive("heading") && "bg-secondary")}
            >
              {activeLevel ? `H${activeLevel}` : "正文"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn("flex items-center gap-2", !editor.isActive("heading") && "bg-secondary")}
            >
              正文
            </DropdownMenuItem>
            {levels.map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                className={cn("flex items-center gap-2", editor.isActive("heading", { level }) && "bg-secondary")}
              >
                H{level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>
        <span>标题</span>
      </TooltipContent>
    </Tooltip>
  );
}
