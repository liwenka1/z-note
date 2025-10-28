import { Editor } from "@tiptap/react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { ChevronDown, List, ListOrdered, CheckSquare } from "lucide-react";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface ListDropdownProps {
  editor: Editor | null;
}

export function ListDropdown({ editor }: ListDropdownProps) {
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run();

  const isActive = editorState.isBulletList || editorState.isOrderedList || editorState.isTaskList;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className={cn("h-8 w-max gap-1 px-2", isActive && "bg-secondary")}>
              <List className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              editor.chain().focus();
            }}
          >
            <DropdownMenuItem
              onClick={toggleBulletList}
              className={cn("flex items-center gap-2", editorState.isBulletList && "bg-secondary")}
            >
              <List className="h-4 w-4" />
              <span>无序列表</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={toggleOrderedList}
              className={cn("flex items-center gap-2", editorState.isOrderedList && "bg-secondary")}
            >
              <ListOrdered className="h-4 w-4" />
              <span>有序列表</span>
            </DropdownMenuItem>

            {/* 任务列表 */}
            <DropdownMenuItem
              onClick={toggleTaskList}
              className={cn("flex items-center gap-2", editorState.isTaskList && "bg-secondary")}
            >
              <CheckSquare className="h-4 w-4" />
              <span>任务列表</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>列表</TooltipContent>
    </Tooltip>
  );
}
