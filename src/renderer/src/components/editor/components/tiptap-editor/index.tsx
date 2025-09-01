import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect } from "react";
import { cn } from "@renderer/lib/utils";
import { EditorToolbar } from "./toolbar";
import { TIPTAP_CONFIG } from "../../constants/editor";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
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
  placeholder = TIPTAP_CONFIG.DEFAULT_PLACEHOLDER
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: TIPTAP_CONFIG.LINK_CLASS
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
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: TIPTAP_CONFIG.EDITOR_PROPS_CLASS
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
    if (editor && content !== editor.getHTML()) {
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
