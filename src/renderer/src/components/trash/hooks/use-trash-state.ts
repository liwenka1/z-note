import { useState } from "react";
import { useNotesStore } from "@renderer/store";
import { filterNotesByDeleted } from "@renderer/utils/data-utils";
import type { Note } from "@renderer/types";

/**
 * Trash 状态管理 Hook
 * 封装与 useNotesStore 的交互，提供简化的接口
 * 参考 chat 的 use-chat-state.ts
 */
export function useTrashState() {
  const notes = useNotesStore((state) => state.notes);
  const folders = useNotesStore((state) => state.folders);
  const restoreNote = useNotesStore((state) => state.restoreNote);
  const permanentDeleteNote = useNotesStore((state) => state.permanentDeleteNote);

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // 获取已删除的笔记
  const deletedNotes = filterNotesByDeleted(notes, true);
  const hasDeletedNotes = deletedNotes.length > 0;

  // 处理恢复对话框
  const openRestoreDialog = (note: Note) => {
    setSelectedNote(note);
    setRestoreDialogOpen(true);
  };

  const closeRestoreDialog = () => {
    setRestoreDialogOpen(false);
    setSelectedNote(null);
  };

  return {
    // 状态
    notes,
    folders,
    deletedNotes,
    hasDeletedNotes,
    restoreDialogOpen,
    selectedNote,

    // 操作函数
    restoreNote,
    permanentDeleteNote,
    openRestoreDialog,
    closeRestoreDialog
  };
}
