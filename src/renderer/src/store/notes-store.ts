import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  Note,
  Folder,
  Tag,
  CreateNoteInput,
  UpdateNoteInput,
  CreateFolderInput,
  UpdateFolderInput
} from "@renderer/types";
import { mockData } from "@renderer/data/mock-data";
import {
  createNoteData,
  updateNoteData,
  createFolderData,
  buildFolderTree,
  filterNotesByFolder,
  filterNotesByDeleted,
  searchNotes,
  sortNotes
} from "@renderer/utils/data-utils";

// ==================== Store 状态类型 ====================
interface NotesState {
  // 核心数据
  notes: Note[];
  folders: Folder[];
  tags: Tag[];

  // UI 状态
  selectedFolderId?: string;
  selectedNoteId?: string;
  isLoading: boolean;
  error?: string;

  // 计算属性（通过 getter 实现）
  folderTree: Folder[];
  currentFolderNotes: Note[];
  allNotes: Note[]; // 非删除的笔记
  deletedNotes: Note[]; // 已删除的笔记
  favoriteNotes: Note[]; // 收藏的笔记
}

interface NotesActions {
  // ==================== 数据初始化 ====================
  initializeData: () => void;
  loadFromLocalStorage: () => boolean;
  saveToLocalStorage: () => void;
  resetData: () => void;

  // ==================== 笔记操作 ====================
  createNote: (input: CreateNoteInput) => string; // 返回新笔记ID
  updateNote: (id: string, updates: UpdateNoteInput) => void;
  deleteNote: (id: string) => void; // 软删除
  permanentDeleteNote: (id: string) => void; // 永久删除
  restoreNote: (id: string) => void; // 从垃圾箱恢复
  toggleNoteFavorite: (id: string) => void;
  moveNoteToFolder: (noteId: string, folderId?: string) => void;

  // ==================== 文件夹操作 ====================
  createFolder: (input: CreateFolderInput) => string; // 返回新文件夹ID
  updateFolder: (id: string, updates: UpdateFolderInput) => void;
  deleteFolder: (id: string) => void; // 删除文件夹及其子文件夹
  toggleFolderExpanded: (id: string) => void;
  moveFolderToParent: (folderId: string, parentId?: string) => void;

  // ==================== 标签操作 ====================
  createTag: (input: CreateNoteInput) => string; // 返回新标签ID
  updateTag: (id: string, updates: UpdateNoteInput) => void;
  deleteTag: (id: string) => void; // 删除标签
  addTagToNote: (noteId: string, tagId: string) => void;
  removeTagFromNote: (noteId: string, tagId: string) => void;

  // ==================== UI 状态管理 ====================
  setSelectedFolder: (folderId?: string) => void;
  setSelectedNote: (noteId?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;

  // ==================== 查询方法 ====================
  getNoteById: (id: string) => Note | undefined;
  getFolderById: (id: string) => Folder | undefined;
  getNotesByFolder: (folderId?: string) => Note[];
  getNotesCount: (folderId: string) => number;
  getTotalNotesCount: (folderId: string) => number; // 包含子文件夹的笔记数
  searchNotesInFolder: (query: string, folderId?: string) => Note[];
  getFolderPath: (folderId: string) => string[];
}

type NotesStore = NotesState & NotesActions;

// ==================== 常量配置 ====================
const STORAGE_KEY = "z-note-data";
const STORAGE_VERSION = "1.0";

// ==================== Store 实现 ====================
export const useNotesStore = create<NotesStore>()(
  immer((set, get) => ({
    // ==================== 初始状态 ====================
    notes: [],
    folders: [],
    tags: [],
    selectedFolderId: undefined,
    selectedNoteId: undefined,
    isLoading: false,
    error: undefined,

    // ==================== 计算属性 ====================
    get folderTree() {
      return buildFolderTree(get().folders.filter((f) => !f.isDeleted));
    },

    get currentFolderNotes() {
      const { selectedFolderId } = get();
      return get().getNotesByFolder(selectedFolderId);
    },

    get allNotes() {
      return filterNotesByDeleted(get().notes, false);
    },

    get deletedNotes() {
      return filterNotesByDeleted(get().notes, true);
    },

    get favoriteNotes() {
      return get().allNotes.filter((note) => note.isFavorite);
    },

    // ==================== 数据初始化 ====================
    initializeData: () => {
      // 首先尝试从 localStorage 加载
      const hasData = get().loadFromLocalStorage();

      set((state) => {
        if (!hasData) {
          // 如果没有保存的数据，使用模拟数据
          state.notes = [...mockData.notes];
          state.folders = [...mockData.folders];
          state.tags = [...mockData.tags];
        }

        state.isLoading = false;
        state.error = undefined;
      });

      // 如果使用了模拟数据，保存到 localStorage
      if (!hasData) {
        get().saveToLocalStorage();
      }
    },

    loadFromLocalStorage: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return false;

        const data = JSON.parse(saved);
        if (data.version !== STORAGE_VERSION) {
          console.warn("数据版本不匹配，使用默认数据");
          return false;
        }

        set((state) => {
          // 恢复数据时需要将日期字符串转换为 Date 对象
          state.notes = data.notes.map((note: unknown) => {
            const n = note as Record<string, unknown>;
            return {
              ...n,
              createdAt: new Date(n.createdAt as string),
              updatedAt: new Date(n.updatedAt as string),
              lastViewedAt: n.lastViewedAt ? new Date(n.lastViewedAt as string) : undefined
            } as Note;
          });

          state.folders = data.folders.map((folder: unknown) => {
            const f = folder as Record<string, unknown>;
            return {
              ...f,
              createdAt: new Date(f.createdAt as string),
              updatedAt: new Date(f.updatedAt as string)
            } as Folder;
          });

          state.tags = data.tags.map((tag: unknown) => {
            const t = tag as Record<string, unknown>;
            return {
              ...t,
              createdAt: new Date(t.createdAt as string),
              updatedAt: new Date(t.updatedAt as string)
            } as Tag;
          });
        });

        return true;
      } catch (error) {
        console.error("加载本地数据失败:", error);
        return false;
      }
    },

    saveToLocalStorage: () => {
      try {
        const { notes, folders, tags } = get();
        const data = {
          version: STORAGE_VERSION,
          notes,
          folders,
          tags,
          savedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("保存数据到本地失败:", error);
        set((state) => {
          state.error = "保存数据失败";
        });
      }
    },

    resetData: () => {
      set((state) => {
        state.notes = [...mockData.notes];
        state.folders = [...mockData.folders];
        state.tags = [...mockData.tags];
        state.selectedFolderId = undefined;
        state.selectedNoteId = undefined;
        state.error = undefined;
      });
      get().saveToLocalStorage();
    },

    // ==================== 笔记操作 ====================
    createNote: (input: CreateNoteInput) => {
      const newNote = createNoteData(input);

      set((state) => {
        state.notes.push(newNote);
        state.selectedNoteId = newNote.id;
      });

      get().saveToLocalStorage();
      return newNote.id;
    },

    updateNote: (id: string, updates: UpdateNoteInput) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          const currentNote = state.notes[noteIndex];
          state.notes[noteIndex] = updateNoteData(currentNote, updates);
        }
      });

      get().saveToLocalStorage();
    },

    deleteNote: (id: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isDeleted = true;
          state.notes[noteIndex].updatedAt = new Date();

          // 如果删除的是当前选中的笔记，清除选中状态
          if (state.selectedNoteId === id) {
            state.selectedNoteId = undefined;
          }
        }
      });

      get().saveToLocalStorage();
    },

    permanentDeleteNote: (id: string) => {
      set((state) => {
        state.notes = state.notes.filter((n) => n.id !== id);

        if (state.selectedNoteId === id) {
          state.selectedNoteId = undefined;
        }
      });

      get().saveToLocalStorage();
    },

    restoreNote: (id: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isDeleted = false;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });

      get().saveToLocalStorage();
    },

    toggleNoteFavorite: (id: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isFavorite = !state.notes[noteIndex].isFavorite;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });

      get().saveToLocalStorage();
    },

    moveNoteToFolder: (noteId: string, folderId?: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === noteId);
        if (noteIndex !== -1) {
          state.notes[noteIndex].folderId = folderId;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });

      get().saveToLocalStorage();
    },

    // ==================== 文件夹操作 ====================
    createFolder: (input: CreateFolderInput) => {
      const newFolder = createFolderData(input);

      set((state) => {
        state.folders.push(newFolder);
      });

      get().saveToLocalStorage();
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

      get().saveToLocalStorage();
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

          // 删除该文件夹下的笔记
          state.notes.forEach((note) => {
            if (note.folderId === folderId) {
              note.isDeleted = true;
              note.updatedAt = new Date();
            }
          });

          // 递归删除子文件夹
          const children = state.folders.filter((f) => f.parentId === folderId && !f.isDeleted);
          children.forEach((child) => deleteRecursive(child.id));
        };

        deleteRecursive(id);

        // 如果删除的是当前选中的文件夹，清除选中状态
        if (state.selectedFolderId === id) {
          state.selectedFolderId = undefined;
        }
      });

      get().saveToLocalStorage();
    },

    toggleFolderExpanded: (id: string) => {
      set((state) => {
        const folderIndex = state.folders.findIndex((f) => f.id === id);
        if (folderIndex !== -1) {
          state.folders[folderIndex].isExpanded = !state.folders[folderIndex].isExpanded;
        }
      });

      // 展开状态不需要保存到 localStorage，因为这是 UI 状态
    },

    moveFolderToParent: (folderId: string, parentId?: string) => {
      set((state) => {
        const folderIndex = state.folders.findIndex((f) => f.id === folderId);
        if (folderIndex !== -1) {
          state.folders[folderIndex].parentId = parentId;
          state.folders[folderIndex].updatedAt = new Date();
        }
      });

      get().saveToLocalStorage();
    },

    // ==================== 标签操作 ====================
    createTag: (input: CreateNoteInput) => {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        ...input,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "",
        color: ""
      };

      set((state) => {
        state.tags.push(newTag);
      });

      get().saveToLocalStorage();
      return newTag.id;
    },

    updateTag: (id: string, updates: UpdateNoteInput) => {
      set((state) => {
        const tagIndex = state.tags.findIndex((t) => t.id === id);
        if (tagIndex !== -1) {
          Object.assign(state.tags[tagIndex], {
            ...updates,
            updatedAt: new Date()
          });
        }
      });

      get().saveToLocalStorage();
    },

    deleteTag: (id: string) => {
      set((state) => {
        // 从所有笔记中移除此标签
        state.notes.forEach((note) => {
          note.tags = note.tags.filter((tagId) => tagId !== id);
        });

        // 删除标签
        state.tags = state.tags.filter((t) => t.id !== id);
      });

      get().saveToLocalStorage();
    },

    addTagToNote: (noteId: string, tagId: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === noteId);
        const tag = state.tags.find((t) => t.id === tagId);

        if (noteIndex !== -1 && tag && !state.notes[noteIndex].tags.includes(tagId)) {
          state.notes[noteIndex].tags.push(tagId);
          state.notes[noteIndex].updatedAt = new Date();

          // 更新标签使用计数
          tag.usageCount++;
          tag.updatedAt = new Date();
        }
      });

      get().saveToLocalStorage();
    },

    removeTagFromNote: (noteId: string, tagId: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === noteId);
        const tag = state.tags.find((t) => t.id === tagId);

        if (noteIndex !== -1 && tag) {
          const tagIndex = state.notes[noteIndex].tags.indexOf(tagId);
          if (tagIndex !== -1) {
            state.notes[noteIndex].tags.splice(tagIndex, 1);
            state.notes[noteIndex].updatedAt = new Date();

            // 更新标签使用计数
            if (tag.usageCount > 0) {
              tag.usageCount--;
              tag.updatedAt = new Date();
            }
          }
        }
      });

      get().saveToLocalStorage();
    },

    // ==================== UI 状态管理 ====================
    setSelectedFolder: (folderId?: string) => {
      set((state) => {
        state.selectedFolderId = folderId;
        state.selectedNoteId = undefined; // 切换文件夹时清除笔记选择
      });
    },

    setSelectedNote: (noteId?: string) => {
      set((state) => {
        state.selectedNoteId = noteId;

        // 更新最后查看时间
        if (noteId) {
          const noteIndex = state.notes.findIndex((n) => n.id === noteId);
          if (noteIndex !== -1) {
            state.notes[noteIndex].lastViewedAt = new Date();
          }
        }
      });
    },

    setLoading: (loading: boolean) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error?: string) => {
      set((state) => {
        state.error = error;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = undefined;
      });
    },

    // ==================== 查询方法 ====================
    getNoteById: (id: string) => {
      return get().notes.find((note) => note.id === id);
    },

    getFolderById: (id: string) => {
      return get().folders.find((folder) => folder.id === id);
    },

    getNotesByFolder: (folderId?: string) => {
      const allNotes = get().allNotes;
      const folderNotes = filterNotesByFolder(allNotes, folderId);
      return sortNotes(folderNotes, "updatedAt", "desc");
    },

    getNotesCount: (folderId: string) => {
      return filterNotesByFolder(get().allNotes, folderId).length;
    },

    getTotalNotesCount: (folderId: string) => {
      const { folders, allNotes } = get();

      // 获取该文件夹及其所有子文件夹的ID
      const getAllChildFolderIds = (parentId: string): string[] => {
        const children = folders.filter((f) => f.parentId === parentId && !f.isDeleted);
        const childIds = children.map((f) => f.id);

        children.forEach((child) => {
          childIds.push(...getAllChildFolderIds(child.id));
        });

        return childIds;
      };

      const folderIds = [folderId, ...getAllChildFolderIds(folderId)];

      return allNotes.filter((note) => folderIds.includes(note.folderId || "")).length;
    },

    searchNotesInFolder: (query: string, folderId?: string) => {
      const folderNotes = get().getNotesByFolder(folderId);
      return searchNotes(folderNotes, query);
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
    }
  }))
);
