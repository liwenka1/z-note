import { EditorContent, type Editor } from "@tiptap/react";
import { cn } from "@renderer/lib/utils";

interface EditorContentAreaProps {
  editor: Editor | null;
  className?: string;
}

/**
 * 编辑器内容区域组件
 * 专门负责渲染编辑器内容，职责单一
 */
export function EditorContentArea({ editor, className }: EditorContentAreaProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "min-h-full p-6", // 确保最小高度填满容器
        "focus-within:outline-none", // 聚焦时无外边框
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
