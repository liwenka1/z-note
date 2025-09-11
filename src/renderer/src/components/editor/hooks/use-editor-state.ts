import { useEffect } from "react";
import { useNote, useUpdateNote } from "@renderer/hooks";
import { useTabStore } from "@renderer/stores/tab-store";
import { useEditorStore } from "@renderer/stores/editor-store";

/**
 * Editor 状态管理 Hook
 * 使用 React Query 进行数据管理
 */
export function useEditorState(noteId: string) {
  const { data: note, isLoading } = useNote(noteId, !!noteId);
  const { mutate: updateNote } = useUpdateNote();
  const { openTab } = useTabStore();
  const { startEditing, getEditingContent, updateContent, saveNote } = useEditorStore();

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

  // 保存笔记
  const handleSave = () => {
    if (note) {
      const content = getEditingContent(noteId);
      if (content !== undefined && content !== note.content) {
        updateNote(
          {
            id: noteId,
            data: { content }
          },
          {
            onSuccess: () => {
              // 保存成功后，更新编辑器的原始内容状态
              saveNote(noteId);
            }
          }
        );
      }
    }
  };

  return {
    // 状态
    note,
    editingContent,
    isLoading,

    // 操作函数
    handleContentChange,
    handleSave
  };
}
