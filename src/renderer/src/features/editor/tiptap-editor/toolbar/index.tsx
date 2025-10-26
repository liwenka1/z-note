import { Editor } from "@tiptap/react";
import { Separator } from "@renderer/components/ui/separator";
import { cn } from "@renderer/lib/utils";

// 第1组：历史操作
import { HistoryControls } from "./history-controls";

// 第2组：块级元素
import { HeadingDropdown } from "./block-controls/heading-dropdown";
import { ListDropdown } from "./block-controls/list-dropdown";
import { BlockquoteButton } from "./block-controls/blockquote-button";
import { CodeBlockButton } from "./block-controls/code-block-button";

// 第3组：文本格式
import { BoldButton } from "./format-controls/bold-button";
import { ItalicButton } from "./format-controls/italic-button";
import { StrikeButton } from "./format-controls/strike-button";
import { CodeButton } from "./format-controls/code-button";
import { UnderlineButton } from "./format-controls/underline-button";
import { HighlightDropdown } from "./format-controls/highlight-dropdown";
import { LinkButton } from "./format-controls/link-button";

// 第4组：上下标
import { TextScriptControls } from "./text-script-controls";

// 第5组：文本对齐
import { TextAlignControls } from "./text-align-controls";

// 第6组：媒体插入
import { MediaControls } from "./media-controls";

// 第7组：额外控件
import { ExtraControls } from "./extra-controls";

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
        "sticky top-0 z-10",
        "bg-background border border-t-0",
        "flex h-full flex-wrap items-center justify-center gap-1 p-1",
        "shadow-sm",
        className
      )}
    >
      {/* 第1组：历史操作 */}
      <HistoryControls editor={editor} />
      <Separator orientation="vertical" className="max-h-6" />

      {/* 第2组：块级元素 */}
      <div className="flex items-center gap-1">
        <HeadingDropdown editor={editor} />
        <ListDropdown editor={editor} />
        <BlockquoteButton editor={editor} />
        <CodeBlockButton editor={editor} />
      </div>
      <Separator orientation="vertical" className="max-h-6" />

      {/* 第3组：文本格式 */}
      <div className="flex items-center gap-1">
        <BoldButton editor={editor} />
        <ItalicButton editor={editor} />
        <StrikeButton editor={editor} />
        <CodeButton editor={editor} />
        <UnderlineButton editor={editor} />
        <HighlightDropdown editor={editor} />
        <LinkButton editor={editor} />
      </div>
      <Separator orientation="vertical" className="max-h-6" />

      {/* 第4组：上下标 */}
      <TextScriptControls editor={editor} />
      <Separator orientation="vertical" className="max-h-6" />

      {/* 第5组：文本对齐 */}
      <TextAlignControls editor={editor} />
      <Separator orientation="vertical" className="max-h-6" />

      {/* 第6组：媒体插入 */}
      <MediaControls editor={editor} />
      <Separator orientation="vertical" className="max-h-6" />

      {/* 第7组：额外控件（保留现有功能） */}
      <ExtraControls editor={editor} />
    </div>
  );
}
