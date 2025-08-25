import { useNotesStore } from "@renderer/store";

/**
 * Files 状态管理 Hook
 * 封装与 useNotesStore 的交互，提供简化的接口
 * 参考 chat 的 use-chat-state.ts
 */
export function useFilesState() {
  const { folders, notes } = useNotesStore();

  // 检查是否有活跃的文件或文件夹
  const activeFolders = folders.filter((f) => !f.isDeleted);
  const activeNotes = notes.filter((n) => !n.isDeleted);
  const hasContent = activeFolders.length > 0 || activeNotes.length > 0;

  return {
    // 状态
    folders,
    notes,
    activeFolders,
    activeNotes,
    hasContent
  };
}
