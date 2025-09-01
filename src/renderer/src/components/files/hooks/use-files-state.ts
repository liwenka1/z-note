import { useFolders, useNotes } from "@renderer/hooks";

/**
 * Files 状态管理 Hook
 * 使用 React Query 进行数据管理
 */
export function useFilesState() {
  const { data: folders = [], isLoading: foldersLoading } = useFolders();
  const { data: notes = [], isLoading: notesLoading } = useNotes();

  // 检查是否有活跃的文件或文件夹
  const activeFolders = folders.filter((f) => !f.isDeleted);
  const activeNotes = notes.filter((n) => !n.isDeleted);
  const hasContent = activeFolders.length > 0 || activeNotes.length > 0;

  const isLoading = foldersLoading || notesLoading;

  return {
    // 状态
    folders,
    notes,
    activeFolders,
    activeNotes,
    hasContent,
    isLoading,

    // 加载状态
    foldersLoading,
    notesLoading
  };
}
