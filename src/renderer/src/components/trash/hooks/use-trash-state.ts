import { useState } from "react";
import {
  useNotes,
  useFolders,
  useRestoreNote,
  useRestoreFolder,
  usePermanentDeleteNote,
  usePermanentDeleteFolder
} from "@renderer/hooks";
import type { Note, Folder } from "@renderer/types";

/**
 * Trash 状态管理 Hook
 * 管理垃圾箱的状态和操作
 */
export function useTrashState() {
  // 获取所有数据（包括已删除的）
  const { data: allNotes = [] } = useNotes({ includeDeleted: true });
  const { data: allFolders = [] } = useFolders();

  // Mutation hooks
  const { mutate: restoreNote } = useRestoreNote();
  const { mutate: restoreFolder } = useRestoreFolder();
  const { mutate: permanentDeleteNote } = usePermanentDeleteNote();
  const { mutate: permanentDeleteFolder } = usePermanentDeleteFolder();

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // 过滤已删除的数据
  const deletedNotes = allNotes.filter((note) => note.isDeleted);
  const deletedFolders = allFolders.filter((folder) => folder.isDeleted);

  const hasDeletedItems = deletedNotes.length > 0 || deletedFolders.length > 0;

  // 处理恢复对话框
  const openRestoreDialog = (note: Note) => {
    setSelectedNote(note);
    setRestoreDialogOpen(true);
  };

  const closeRestoreDialog = () => {
    setRestoreDialogOpen(false);
    setSelectedNote(null);
  };

  // 恢复笔记
  const handleRestoreNote = (note: Note) => {
    restoreNote(note.id, {
      onSuccess: (restoredNote) => {
        console.log("笔记恢复成功:", restoredNote.title);
        closeRestoreDialog();
      },
      onError: (error) => {
        console.error("笔记恢复失败:", error);
      }
    });
  };

  // 恢复文件夹
  const handleRestoreFolder = (folder: Folder) => {
    restoreFolder(folder.id, {
      onSuccess: (restoredFolder) => {
        console.log("文件夹恢复成功:", restoredFolder.name);
      },
      onError: (error) => {
        console.error("文件夹恢复失败:", error);
      }
    });
  };

  // 永久删除笔记
  const handlePermanentDeleteNote = (note: Note) => {
    if (confirm(`确定要永久删除笔记"${note.title}"吗？此操作无法撤销。`)) {
      permanentDeleteNote(note.id, {
        onSuccess: () => {
          console.log("笔记已永久删除");
        },
        onError: (error) => {
          console.error("永久删除失败:", error);
        }
      });
    }
  };

  // 永久删除文件夹
  const handlePermanentDeleteFolder = (folder: Folder) => {
    if (confirm(`确定要永久删除文件夹"${folder.name}"吗？此操作无法撤销。`)) {
      permanentDeleteFolder(folder.id, {
        onSuccess: () => {
          console.log("文件夹已永久删除");
        },
        onError: (error) => {
          console.error("永久删除失败:", error);
        }
      });
    }
  };

  return {
    // 状态
    allNotes,
    allFolders,
    deletedNotes,
    deletedFolders,
    hasDeletedItems,
    restoreDialogOpen,
    selectedNote,

    // 操作函数
    handleRestoreNote,
    handleRestoreFolder,
    handlePermanentDeleteNote,
    handlePermanentDeleteFolder,
    openRestoreDialog,
    closeRestoreDialog
  };
}
