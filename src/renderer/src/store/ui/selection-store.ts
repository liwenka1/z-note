import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ==================== UI选中状态类型 ====================
interface SelectionState {
  selectedFolderId?: string;
  selectedNoteId?: string;
}

interface SelectionActions {
  setSelectedFolder: (folderId?: string) => void;
  setSelectedNote: (noteId?: string) => void;
  clearSelection: () => void;
}

type SelectionStore = SelectionState & SelectionActions;

// ==================== Store 实现 ====================
export const useSelectionStore = create<SelectionStore>()(
  immer((set) => ({
    // ==================== 初始状态 ====================
    selectedFolderId: undefined,
    selectedNoteId: undefined,

    // ==================== 选中状态管理 ====================
    setSelectedFolder: (folderId?: string) => {
      set((state) => {
        state.selectedFolderId = folderId;
        state.selectedNoteId = undefined; // 切换文件夹时清除笔记选择
      });
    },

    setSelectedNote: (noteId?: string) => {
      set((state) => {
        state.selectedNoteId = noteId;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedFolderId = undefined;
        state.selectedNoteId = undefined;
      });
    }
  }))
);
