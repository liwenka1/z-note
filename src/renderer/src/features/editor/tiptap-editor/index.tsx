import { useEditor, type JSONContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { cn } from "@renderer/lib/utils";
import { EditorToolbar } from "./toolbar";
import { EditorContentArea } from "./editor-content";
import { createEditorExtensions } from "./editor-extensions";
import { useEditorStore } from "@renderer/stores/editor-store";

interface TipTapEditorProps {
  noteId: string;
  initialContent: JSONContent;
  onSave?: () => void;
  editable?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * TipTap 编辑器组件
 *
 * 关键设计：
 * 1. useEditor 不依赖 noteId - 确保实例不会因 noteId 变化而重建
 * 2. 每个笔记对应一个独立的组件实例
 * 3. 通过父组件的 display 控制显示/隐藏
 *
 * 参考：VSCode Monaco Editor 的实例管理模式
 */
export function TipTapEditor({
  noteId,
  initialContent,
  onSave,
  editable = true,
  className = "",
  placeholder = "开始写作..."
}: TipTapEditorProps) {
  const { registerEditor, unregisterEditor, notifyContentChanged } = useEditorStore();
  const hasRegisteredRef = useRef(false);
  const isReadyRef = useRef(false); // 标记编辑器是否已完成初始化

  // 🔑 关键：空依赖数组 - 编辑器实例只创建一次，永不重建
  const editor = useEditor({
    extensions: createEditorExtensions(placeholder),
    content: initialContent,
    editable,
    onUpdate: () => {
      // 🔑 只有在编辑器完成初始化后才通知内容变化
      if (!isReadyRef.current) {
        return;
      }
      // 通知 store 内容已变化，触发订阅组件重新渲染
      notifyContentChanged();
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none"
      },
      handleKeyDown: (_view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
          event.preventDefault();
          onSave?.();
          return true;
        }
        return false;
      }
    }
  }); // ✅ 空依赖 - 这是关键！

  // 注册编辑器实例到 store
  useEffect(() => {
    if (editor && !hasRegisteredRef.current) {
      // 🔑 等待下一个事件循环，确保 TipTap 完成初始化和内容规范化
      // 然后使用编辑器当前的 JSON 作为 originalContent
      setTimeout(() => {
        const normalizedContent = editor.getJSON();
        registerEditor(noteId, editor, normalizedContent);
        isReadyRef.current = true; // 标记为已就绪
      }, 0);
      hasRegisteredRef.current = true;
    }
  }, [editor, noteId, registerEditor]);

  // 组件卸载时注销编辑器（只在关闭 tab 时触发）
  useEffect(() => {
    return () => {
      if (hasRegisteredRef.current) {
        unregisterEditor(noteId);
        hasRegisteredRef.current = false;
        isReadyRef.current = false;
      }
    };
  }, [noteId, unregisterEditor]);

  if (!editor) {
    return <div className="flex h-full items-center justify-center">加载编辑器...</div>;
  }

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
