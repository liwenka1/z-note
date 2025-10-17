import { useEditor, type JSONContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { cn } from "@renderer/lib/utils";
import { EditorToolbar } from "./components/editor-toolbar";
import { EditorContentArea } from "./components/editor-content";
import { createEditorExtensions } from "./components/editor-extensions";

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
  // 用于防止在设置内容时触发 onChange
  const isSettingContentRef = useRef(false);
  // 用于跟踪编辑器是否已初始化内容
  const hasInitializedRef = useRef(false);

  const editor = useEditor({
    extensions: createEditorExtensions(placeholder),
    editable,
    content,
    onUpdate: ({ editor }) => {
      // 如果当前正在设置内容，则不触发 onChange
      if (isSettingContentRef.current) {
        return;
      }
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none"
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

  // 标记编辑器已初始化
  useEffect(() => {
    if (editor) {
      hasInitializedRef.current = true;
    }
  }, [editor]);

  // 只在外部内容真正改变时更新编辑器（比如切换笔记）
  useEffect(() => {
    if (!editor || !hasInitializedRef.current) {
      return;
    }

    // 检查外部内容是否与编辑器当前内容不同
    const currentContent = editor.getJSON();
    const contentChanged = JSON.stringify(currentContent) !== JSON.stringify(content);

    if (contentChanged) {
      // 设置标志，防止触发 onChange
      isSettingContentRef.current = true;

      // 保存当前光标位置
      const { from, to } = editor.state.selection;

      editor.commands.setContent(content);

      // 尝试恢复光标位置（如果位置仍然有效）
      try {
        const docSize = editor.state.doc.content.size;
        if (from <= docSize && to <= docSize) {
          editor.commands.setTextSelection({ from, to });
        }
      } catch (e) {
        // 如果恢复失败，忽略错误
        console.debug("Could not restore cursor position:", e);
      }

      // 重置标志
      isSettingContentRef.current = false;
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
    <div className={cn("flex h-full flex-col", className)}>
      {/* 固定工具栏 - 不参与滚动 */}
      <div className="flex-shrink-0">
        <EditorToolbar editor={editor} />
      </div>

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-auto">
        <EditorContentArea editor={editor} />
      </div>
    </div>
  );
}
