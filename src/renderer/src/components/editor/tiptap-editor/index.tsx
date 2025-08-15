import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect } from "react";
import { cn } from "@renderer/lib/utils";
import { EditorToolbar } from "./toolbar";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  className?: string;
  placeholder?: string;
  showToolbar?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  editable = true,
  className,
  placeholder = "开始写作...",
  showToolbar = true
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
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          "focus:outline-none prose prose-neutral dark:prose-invert max-w-none",
          showToolbar ? "min-h-[200px] p-4" : "min-h-[200px] p-4"
        )
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
      {showToolbar && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
