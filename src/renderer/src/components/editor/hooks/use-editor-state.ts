import { useEffect } from "react";
import { useNotesStore } from "@renderer/store";
import { useTabStore } from "@renderer/store/tab-store";
import { useEditorStore } from "@renderer/store/editor-store";

/**
 * Editor 状态管理 Hook
 * 封装编辑器相关的状态和逻辑
 * 参考 chat 的 use-chat-state.ts
 */
export function useEditorState(noteId: string) {
  const { notes } = useNotesStore();
  const { openTab } = useTabStore();
  const { startEditing, getEditingContent, updateContent } = useEditorStore();

  const note = notes.find((n) => n.id === noteId);

  // 获取编辑内容，如果没有则使用笔记原始内容
  const editingContent = getEditingContent(noteId) || note?.content || "";

  // 当页面加载时，确保标签是打开的并初始化编辑状态
  useEffect(() => {
    if (note) {
      openTab(noteId, note.title);

      // 只在还没有编辑状态时才开始编辑
      if (getEditingContent(noteId) === undefined) {
        startEditing(noteId, note.content);
      }
    }
  }, [noteId, note, openTab, startEditing, getEditingContent]);

  // 处理内容变化
  const handleContentChange = (newContent: string) => {
    updateContent(noteId, newContent);
  };

  return {
    // 状态
    note,
    editingContent,

    // 操作函数
    handleContentChange
  };
}
