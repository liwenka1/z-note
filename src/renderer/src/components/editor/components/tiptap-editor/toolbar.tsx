import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Undo, Redo, Link2 } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Separator } from "@renderer/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib/utils";

interface EditorToolbarProps {
  editor: Editor;
  className?: string;
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

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

  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-1 border-b p-1", className)}>
      {/* 撤销/重做 */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={undo} disabled={!editor.can().undo()} className="h-8 w-8 p-0">
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>撤销 (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={redo} disabled={!editor.can().redo()} className="h-8 w-8 p-0">
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>重做 (Ctrl+Y)</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* 标题 */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <Tooltip key={level}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHeading(level as 1 | 2 | 3 | 4 | 5 | 6)}
                className={cn(
                  "h-8 px-2",
                  "text-xs font-medium",
                  editor.isActive("heading", { level }) && "bg-secondary"
                )}
              >
                H{level}
              </Button>
            </TooltipTrigger>
            <TooltipContent>标题 {level}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* 文本格式 */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBold}
              className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-secondary")}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>粗体 (Ctrl+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleItalic}
              className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-secondary")}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>斜体 (Ctrl+I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleStrike}
              className={cn("h-8 w-8 p-0", editor.isActive("strike") && "bg-secondary")}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除线</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCode}
              className={cn("h-8 w-8 p-0", editor.isActive("code") && "bg-secondary")}
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>行内代码</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* 列表和引用 */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBulletList}
              className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-secondary")}
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
              className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-secondary")}
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
              className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-secondary")}
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
    </div>
  );
}
