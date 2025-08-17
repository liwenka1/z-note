import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Folder, CreateFolderInput, UpdateFolderInput } from "@renderer/types";
import { createFolderData, buildFolderTree } from "@renderer/utils/data-utils";

// ==================== 文件夹状态类型 ====================
interface FoldersState {
  folders: Folder[];
}

interface FoldersActions {
  // ==================== 文件夹操作 ====================
  createFolder: (input: CreateFolderInput) => string;
  updateFolder: (id: string, updates: UpdateFolderInput) => void;
  deleteFolder: (id: string) => void;
  permanentDeleteFolder: (id: string) => void;
  restoreFolder: (id: string, targetParentId?: string) => void;
  toggleFolderExpanded: (id: string) => void;
  moveFolderToParent: (folderId: string, parentId?: string) => void;

  // ==================== 查询方法 ====================
  getFolderById: (id: string) => Folder | undefined;
  getFolderTree: () => Folder[];
  getAllFolders: () => Folder[];
  getDeletedFolders: () => Folder[];
  getFolderPath: (folderId: string) => string[];
  getChildFolders: (parentId?: string) => Folder[];

  // ==================== 数据管理 ====================
  setFolders: (folders: Folder[]) => void;
  clearFolders: () => void;
}

type FoldersStore = FoldersState & FoldersActions;

// ==================== Store 实现 ====================
export const useFoldersStore = create<FoldersStore>()(
  immer((set, get) => ({
    // ==================== 初始状态 ====================
    folders: [],

    // ==================== 文件夹操作 ====================
    createFolder: (input: CreateFolderInput) => {
      const newFolder = createFolderData(input);

      set((state) => {
        state.folders.push(newFolder);
      });

      return newFolder.id;
    },

    updateFolder: (id: string, updates: UpdateFolderInput) => {
      set((state) => {
        const folderIndex = state.folders.findIndex((f) => f.id === id);
        if (folderIndex !== -1) {
          state.folders[folderIndex] = {
            ...state.folders[folderIndex],
            ...updates,
            updatedAt: new Date()
          };
        }
      });
    },

    deleteFolder: (id: string) => {
      set((state) => {
        // 递归删除子文件夹
        const deleteRecursive = (folderId: string) => {
          // 删除文件夹
          const folderIndex = state.folders.findIndex((f) => f.id === folderId);
          if (folderIndex !== -1) {
            state.folders[folderIndex].isDeleted = true;
            state.folders[folderIndex].updatedAt = new Date();
          }

          // 递归删除子文件夹
          const children = state.folders.filter((f) => f.parentId === folderId && !f.isDeleted);
          children.forEach((child) => deleteRecursive(child.id));
        };

        deleteRecursive(id);
      });
    },

    permanentDeleteFolder: (id: string) => {
      set((state) => {
        // 递归永久删除子文件夹
        const deleteRecursive = (folderId: string) => {
          // 获取子文件夹列表
          const children = state.folders.filter((f) => f.parentId === folderId);
          children.forEach((child) => deleteRecursive(child.id));

          // 永久删除文件夹
          state.folders = state.folders.filter((f) => f.id !== folderId);
        };

        deleteRecursive(id);
      });
    },

    restoreFolder: (id: string, targetParentId?: string) => {
      set((state) => {
        const folderIndex = state.folders.findIndex((f) => f.id === id);
        if (folderIndex !== -1) {
          state.folders[folderIndex].isDeleted = false;
          // 如果指定了新的父级，则移动到新位置
          if (targetParentId !== undefined) {
            state.folders[folderIndex].parentId = targetParentId;
          }
          state.folders[folderIndex].updatedAt = new Date();

          // 递归恢复子文件夹
          const children = state.folders.filter((f) => f.parentId === id);
          children.forEach((child) => {
            if (child.isDeleted) {
              get().restoreFolder(child.id);
            }
          });
        }
      });
    },

    toggleFolderExpanded: (id: string) => {
      set((state) => {
        const folderIndex = state.folders.findIndex((f) => f.id === id);
        if (folderIndex !== -1) {
          state.folders[folderIndex].isExpanded = !state.folders[folderIndex].isExpanded;
        }
      });
    },

    moveFolderToParent: (folderId: string, parentId?: string) => {
      set((state) => {
        const folderIndex = state.folders.findIndex((f) => f.id === folderId);
        if (folderIndex !== -1) {
          state.folders[folderIndex].parentId = parentId;
          state.folders[folderIndex].updatedAt = new Date();
        }
      });
    },

    // ==================== 查询方法 ====================
    getFolderById: (id: string) => {
      return get().folders.find((folder) => folder.id === id);
    },

    getFolderTree: () => {
      return buildFolderTree(get().folders.filter((f) => !f.isDeleted));
    },

    getAllFolders: () => {
      return get().folders.filter((f) => !f.isDeleted);
    },

    getDeletedFolders: () => {
      return get().folders.filter((f) => f.isDeleted);
    },

    getFolderPath: (folderId: string) => {
      const { folders } = get();
      const path: string[] = [];

      let currentId: string | undefined = folderId;
      while (currentId) {
        const folder = folders.find((f) => f.id === currentId);
        if (folder) {
          path.unshift(folder.name);
          currentId = folder.parentId;
        } else {
          break;
        }
      }

      return path;
    },

    getChildFolders: (parentId?: string) => {
      return get()
        .getAllFolders()
        .filter((f) => f.parentId === parentId);
    },

    // ==================== 数据管理 ====================
    setFolders: (folders: Folder[]) => {
      set((state) => {
        state.folders = folders;
      });
    },

    clearFolders: () => {
      set((state) => {
        state.folders = [];
      });
    }
  }))
);
