import { Editor } from "@tiptap/react";
import { List, ListOrdered, Quote, Link2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface ListControlsProps {
  editor: Editor | null;
}

export function ListControls({ editor }: ListControlsProps) {
  // 使用官方推荐的 useEditorState hook 订阅编辑器状态
  const editorState = useEditorActiveState(editor);

  if (!editor) {
    return null;
  }

  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // 如果用户取消或者输入空 URL，则移除链接
    if (url === null) {
      return;
    }

    // 如果 URL 为空，则移除链接
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // 更新链接
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBulletList}
            className={cn("h-8 w-8 p-0", editorState.isBulletList && "bg-secondary")}
          >
            <List className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>无序列表</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOrderedList}
            className={cn("h-8 w-8 p-0", editorState.isOrderedList && "bg-secondary")}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>有序列表</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBlockquote}
            className={cn("h-8 w-8 p-0", editorState.isBlockquote && "bg-secondary")}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>引用</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-secondary")}
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>链接</TooltipContent>
      </Tooltip>
    </div>
  );
}
