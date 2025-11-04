import { Editor } from "@tiptap/react";
import { Link2, ExternalLink, Unlink, Check } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Input } from "@renderer/components/ui/input";
import { cn } from "@renderer/lib/utils";
import { useState, useEffect } from "react";
import { useEditorActiveState } from "../../../hooks/use-editor-active-state";

interface LinkButtonProps {
  editor: Editor | null;
}

export function LinkButton({ editor }: LinkButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const editorState = useEditorActiveState(editor);

  const isActive = editorState.isLink;

  // 当链接激活状态变化时，自动打开/关闭 Popover
  useEffect(() => {
    if (!editor) return;

    if (isActive) {
      // 光标在链接上，自动打开 Popover
      setIsOpen(true);
      const { href } = editor.getAttributes("link");
      setUrl(href || "");
    } else {
      // 光标离开链接，关闭 Popover
      setIsOpen(false);
    }
  }, [isActive, editor]);

  // 当 Popover 打开时，获取当前链接
  useEffect(() => {
    if (!editor || !isOpen) return;

    const { href } = editor.getAttributes("link");
    setUrl(href || "");
  }, [isOpen, editor]);

  if (!editor) {
    return null;
  }

  // 应用链接
  const applyLink = () => {
    if (!url) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, "");

    // 如果有选中的文本或当前在链接上，直接设置链接
    if (selectedText || isActive) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      // 如果没有选中文本，插入链接文本
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    }

    setIsOpen(false);
    setUrl("");
  };

  // 打开链接
  const openLink = () => {
    const { href } = editor.getAttributes("link");
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  // 删除链接
  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
    setUrl("");
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLink();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", isActive && "bg-secondary")}>
              <Link2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>链接</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 p-3" align="start">
        <div className="flex items-center gap-2">
          {/* URL 输入框 */}
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="粘贴链接..."
            className="flex-1"
            autoFocus
          />

          {/* 应用链接按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={applyLink} disabled={!url} className="h-8 w-8 shrink-0 p-0">
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>应用链接</TooltipContent>
          </Tooltip>

          {/* 打开链接按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={openLink}
                disabled={!isActive}
                className="h-8 w-8 shrink-0 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>打开链接</TooltipContent>
          </Tooltip>

          {/* 删除链接按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={removeLink}
                disabled={!isActive}
                className="h-8 w-8 shrink-0 p-0"
              >
                <Unlink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>删除链接</TooltipContent>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
}
