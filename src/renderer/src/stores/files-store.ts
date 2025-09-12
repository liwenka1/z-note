import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ==================== Files UI 状态类型 ====================
interface FilesUIState {
  // 选中状态
  selectedTagId?: number;
  selectedNoteId?: number;

  // 标签展开状态
  expandedTagIds: Set<number>;

  // 视图设置
  viewMode: "list" | "grid";
  sortBy: "name" | "createdAt" | "updatedAt";
  sortDirection: "asc" | "desc";

  // 搜索状态
  searchQuery: string;

  // 选择模式（多选）
  isSelectionMode: boolean;
  selectedItems: Set<number>; // 笔记的ID
}

interface FilesUIActions {
  // ==================== 选中状态管理 ====================
  setSelectedTag: (tagId?: number) => void;
  setSelectedNote: (noteId?: number) => void;
  clearSelection: () => void;

  // ==================== 标签展开状态 ====================
  toggleTagExpanded: (tagId: number) => void;
  expandTag: (tagId: number) => void;
  collapseTag: (tagId: number) => void;
  collapseAllTags: () => void;

  // ==================== 视图设置 ====================
  setViewMode: (mode: "list" | "grid") => void;
  setSortBy: (sortBy: "name" | "createdAt" | "updatedAt") => void;
  setSortDirection: (direction: "asc" | "desc") => void;

  // ==================== 搜索状态 ====================
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // ==================== 多选模式 ====================
  toggleSelectionMode: () => void;
  toggleItemSelection: (itemId: number) => void;
  selectAllItems: (itemIds: number[]) => void;
  clearItemSelection: () => void;
  exitSelectionMode: () => void;
}

type FilesUIStore = FilesUIState & FilesUIActions;

// ==================== Store 实现 ====================
export const useFilesStore = create<FilesUIStore>()(
  immer((set) => ({
    // ==================== 初始状态 ====================
    selectedTagId: undefined,
    selectedNoteId: undefined,
    expandedTagIds: new Set(),
    viewMode: "list",
    sortBy: "updatedAt",
    sortDirection: "desc",
    searchQuery: "",
    isSelectionMode: false,
    selectedItems: new Set(),

    // ==================== 选中状态管理 ====================
    setSelectedTag: (tagId?: number) => {
      set((state) => {
        state.selectedTagId = tagId;
        state.selectedNoteId = undefined; // 切换标签时清除笔记选择
      });
    },

    setSelectedNote: (noteId?: number) => {
      set((state) => {
        state.selectedNoteId = noteId;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedTagId = undefined;
        state.selectedNoteId = undefined;
      });
    },

    // ==================== 标签展开状态 ====================
    toggleTagExpanded: (tagId: number) => {
      set((state) => {
        if (state.expandedTagIds.has(tagId)) {
          state.expandedTagIds.delete(tagId);
        } else {
          state.expandedTagIds.add(tagId);
        }
      });
    },

    expandTag: (tagId: number) => {
      set((state) => {
        state.expandedTagIds.add(tagId);
      });
    },

    collapseTag: (tagId: number) => {
      set((state) => {
        state.expandedTagIds.delete(tagId);
      });
    },

    collapseAllTags: () => {
      set((state) => {
        state.expandedTagIds.clear();
      });
    },

    // ==================== 视图设置 ====================
    setViewMode: (mode: "list" | "grid") => {
      set((state) => {
        state.viewMode = mode;
      });
    },

    setSortBy: (sortBy: "name" | "createdAt" | "updatedAt") => {
      set((state) => {
        state.sortBy = sortBy;
      });
    },

    setSortDirection: (direction: "asc" | "desc") => {
      set((state) => {
        state.sortDirection = direction;
      });
    },

    // ==================== 搜索状态 ====================
    setSearchQuery: (query: string) => {
      set((state) => {
        state.searchQuery = query;
      });
    },

    clearSearch: () => {
      set((state) => {
        state.searchQuery = "";
      });
    },

    // ==================== 多选模式 ====================
    toggleSelectionMode: () => {
      set((state) => {
        state.isSelectionMode = !state.isSelectionMode;
        if (!state.isSelectionMode) {
          state.selectedItems.clear();
        }
      });
    },

    toggleItemSelection: (itemId: number) => {
      set((state) => {
        if (state.selectedItems.has(itemId)) {
          state.selectedItems.delete(itemId);
        } else {
          state.selectedItems.add(itemId);
        }
      });
    },

    selectAllItems: (itemIds: number[]) => {
      set((state) => {
        state.selectedItems = new Set(itemIds);
      });
    },

    clearItemSelection: () => {
      set((state) => {
        state.selectedItems.clear();
      });
    },

    exitSelectionMode: () => {
      set((state) => {
        state.isSelectionMode = false;
        state.selectedItems.clear();
      });
    }
  }))
);

// 导出类型供组件使用
export type { FilesUIStore };
