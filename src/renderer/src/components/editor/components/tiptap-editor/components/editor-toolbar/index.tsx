import { Editor } from "@tiptap/react";
import { Separator } from "@renderer/components/ui/separator";
import { cn } from "@renderer/lib/utils";
import { HistoryControls } from "./components/history-controls";
import { HeadingControls } from "./components/heading-controls";
import { FormatControls } from "./components/format-controls";
import { ListControls } from "./components/list-controls";
import { CodeBlockControl } from "./components/code-block-control";
import { ExtraControls } from "./components/extra-controls";

interface EditorToolbarProps {
  editor: Editor | null;
  className?: string;
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-10", // 添加粘性定位，确保固定在顶部
        "bg-background border border-t-0", // 完整边框，但去掉顶边框（因为贴着顶部）
        "flex flex-wrap items-center justify-center gap-1 p-1",
        "shadow-sm", // 添加轻微阴影增强层次感
        className
      )}
    >
      {/* 历史操作控件 */}
      <HistoryControls editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      {/* 标题控件 */}
      <HeadingControls editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      {/* 格式化控件 */}
      <FormatControls editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      {/* 代码块 */}
      <CodeBlockControl editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      {/* 列表和引用控件 */}
      <ListControls editor={editor} />

      <Separator orientation="vertical" className="h-6" />

      {/* 额外控件（水平线、硬换行、清除格式） */}
      <ExtraControls editor={editor} />
    </div>
  );
}
