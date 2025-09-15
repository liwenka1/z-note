import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect } from "react";
import { cn } from "@renderer/lib/utils";
import { EditorToolbar } from "./toolbar";

interface TipTapEditorProps {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
  onSave?: () => void; // 添加保存回调
  editable?: boolean;
  className?: string;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  onSave,
  editable = true,
  className,
  placeholder = "开始写作..."
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline-offset-4 hover:underline"
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      Typography
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none prose prose-neutral dark:prose-invert max-w-none p-6"
      },
      handleKeyDown: (_view, event) => {
        // 检测 Ctrl+S (Windows/Linux) 或 Cmd+S (macOS)
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
          event.preventDefault();
          onSave?.(); // 调用保存回调
          return true; // 表示事件已处理
        }
        return false; // 让其他按键正常处理
      }
    }
  });

  // 当外部 content 改变时更新编辑器内容
  useEffect(() => {
    if (editor && content && JSON.stringify(content) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div className={cn("", className)}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
