import { Editor } from "@tiptap/react";
import { Highlighter } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface HighlightDropdownProps {
  editor: Editor | null;
}

const highlightColors = [
  { name: "清除高亮", color: null, bgColor: "transparent" },
  { name: "黄色", color: "#fef08a", bgColor: "bg-yellow-200" },
  { name: "绿色", color: "#bbf7d0", bgColor: "bg-green-200" },
  { name: "蓝色", color: "#bfdbfe", bgColor: "bg-blue-200" },
  { name: "粉色", color: "#fecaca", bgColor: "bg-red-200" },
  { name: "紫色", color: "#e9d5ff", bgColor: "bg-purple-200" }
];

export function HighlightDropdown({ editor }: HighlightDropdownProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const setHighlight = (color: string | null) => {
    if (color) {
      editor.chain().focus().setHighlight({ color }).run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", editorState.isHighlight && "bg-secondary")}>
              <Highlighter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              editor.chain().focus();
            }}
          >
            {highlightColors.map((item) => (
              <DropdownMenuItem
                key={item.name}
                onClick={() => setHighlight(item.color)}
                className="flex items-center gap-2"
              >
                <div
                  className={cn("h-4 w-4 rounded border", item.bgColor)}
                  style={item.color ? { backgroundColor: item.color } : undefined}
                />
                <span>{item.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>高亮颜色</TooltipContent>
    </Tooltip>
  );
}
