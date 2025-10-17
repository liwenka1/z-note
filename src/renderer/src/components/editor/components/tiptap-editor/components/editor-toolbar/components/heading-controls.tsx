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
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface HeadingControlsProps {
  editor: Editor | null;
}

const levels = [1, 2, 3, 4] as const;

export function HeadingControls({ editor }: HeadingControlsProps) {
  // 使用官方推荐的 useEditorState hook 订阅编辑器状态
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  // 根据状态确定当前激活的标题级别
  const activeLevel = editorState.isHeading1
    ? 1
    : editorState.isHeading2
      ? 2
      : editorState.isHeading3
        ? 3
        : editorState.isHeading4
          ? 4
          : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 w-max gap-1 px-3 font-normal", activeLevel && "bg-secondary")}
            >
              {activeLevel ? `H${activeLevel}` : "正文"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn("flex items-center gap-2", editorState.isParagraph && "bg-secondary")}
            >
              正文
            </DropdownMenuItem>
            {levels.map((level) => {
              const isActive =
                level === 1
                  ? editorState.isHeading1
                  : level === 2
                    ? editorState.isHeading2
                    : level === 3
                      ? editorState.isHeading3
                      : editorState.isHeading4;

              return (
                <DropdownMenuItem
                  key={level}
                  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                  className={cn("flex items-center gap-2", isActive && "bg-secondary")}
                >
                  H{level}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>
        <span>标题</span>
      </TooltipContent>
    </Tooltip>
  );
}
