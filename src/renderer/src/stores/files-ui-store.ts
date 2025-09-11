import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ==================== Files UI 状态类型 ====================
interface FilesUIState {
  // 选中状态
  selectedFolderId?: string;
  selectedNoteId?: string;

  // 文件夹展开状态
  expandedFolderIds: Set<string>;

  // 视图设置
  viewMode: "list" | "grid";
  sortBy: "name" | "createdAt" | "updatedAt";
  sortDirection: "asc" | "desc";

  // 搜索状态
  searchQuery: string;

  // 选择模式（多选）
  isSelectionMode: boolean;
  selectedItems: Set<string>; // 笔记和文件夹的ID
}

interface FilesUIActions {
  // ==================== 选中状态管理 ====================
  setSelectedFolder: (folderId?: string) => void;
  setSelectedNote: (noteId?: string) => void;
  clearSelection: () => void;

  // ==================== 文件夹展开状态 ====================
  toggleFolderExpanded: (folderId: string) => void;
  expandFolder: (folderId: string) => void;
  collapseFolder: (folderId: string) => void;
  collapseAllFolders: () => void;

  // ==================== 视图设置 ====================
  setViewMode: (mode: "list" | "grid") => void;
  setSortBy: (sortBy: "name" | "createdAt" | "updatedAt") => void;
  setSortDirection: (direction: "asc" | "desc") => void;

  // ==================== 搜索状态 ====================
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // ==================== 多选模式 ====================
  toggleSelectionMode: () => void;
  toggleItemSelection: (itemId: string) => void;
  selectAllItems: (itemIds: string[]) => void;
  clearItemSelection: () => void;
  exitSelectionMode: () => void;
}

type FilesUIStore = FilesUIState & FilesUIActions;

// ==================== Store 实现 ====================
export const useFilesUIStore = create<FilesUIStore>()(
  immer((set) => ({
    // ==================== 初始状态 ====================
    selectedFolderId: undefined,
    selectedNoteId: undefined,
    expandedFolderIds: new Set(),
    viewMode: "list",
    sortBy: "updatedAt",
    sortDirection: "desc",
    searchQuery: "",
    isSelectionMode: false,
    selectedItems: new Set(),

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
    },

    // ==================== 文件夹展开状态 ====================
    toggleFolderExpanded: (folderId: string) => {
      set((state) => {
        if (state.expandedFolderIds.has(folderId)) {
          state.expandedFolderIds.delete(folderId);
        } else {
          state.expandedFolderIds.add(folderId);
        }
      });
    },

    expandFolder: (folderId: string) => {
      set((state) => {
        state.expandedFolderIds.add(folderId);
      });
    },

    collapseFolder: (folderId: string) => {
      set((state) => {
        state.expandedFolderIds.delete(folderId);
      });
    },

    collapseAllFolders: () => {
      set((state) => {
        state.expandedFolderIds.clear();
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

    toggleItemSelection: (itemId: string) => {
      set((state) => {
        if (state.selectedItems.has(itemId)) {
          state.selectedItems.delete(itemId);
        } else {
          state.selectedItems.add(itemId);
        }
      });
    },

    selectAllItems: (itemIds: string[]) => {
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
