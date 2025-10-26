import { Editor } from "@tiptap/react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { ChevronDown, Heading } from "lucide-react";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface HeadingDropdownProps {
  editor: Editor | null;
}

const levels = [1, 2, 3, 4] as const;

export function HeadingDropdown({ editor }: HeadingDropdownProps) {
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

  const toggleHeading = (level: (typeof levels)[number]) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className={cn("h-8 w-max gap-1 px-2", activeLevel && "bg-secondary")}>
              {activeLevel ? <span className="font-semibold">H{activeLevel}</span> : <Heading className="h-4 w-4" />}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault(); // 阻止默认的焦点恢复
              editor.chain().focus(); // 手动恢复到编辑器
            }}
          >
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
                  onClick={() => toggleHeading(level)}
                  className={cn("flex items-center gap-2", isActive && "bg-secondary")}
                >
                  <span className="w-8 font-semibold">H{level}</span>
                  <span className="text-muted-foreground text-xs">标题 {level}</span>
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
