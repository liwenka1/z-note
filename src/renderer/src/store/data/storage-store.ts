import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Note, Folder, Tag } from "@renderer/types";
import { mockData } from "@renderer/data/mock-data";

// ==================== 存储状态类型 ====================
interface StorageState {
  isInitialized: boolean;
}

interface StorageActions {
  // ==================== 数据初始化 ====================
  initializeData: (callbacks: {
    setNotes: (notes: Note[]) => void;
    setFolders: (folders: Folder[]) => void;
    setTags: (tags: Tag[]) => void;
  }) => void;
  loadFromLocalStorage: () => { notes: Note[]; folders: Folder[]; tags: Tag[] } | null;
  saveToLocalStorage: (data: { notes: Note[]; folders: Folder[]; tags: Tag[] }) => void;
  resetData: (callbacks: {
    setNotes: (notes: Note[]) => void;
    setFolders: (folders: Folder[]) => void;
    setTags: (tags: Tag[]) => void;
  }) => void;
}

type StorageStore = StorageState & StorageActions;

// ==================== 常量配置 ====================
const STORAGE_KEY = "z-note-data";
const STORAGE_VERSION = "1.0";

// ==================== Store 实现 ====================
export const useStorageStore = create<StorageStore>()(
  immer((set, get) => ({
    // ==================== 初始状态 ====================
    isInitialized: false,

    // ==================== 数据初始化 ====================
    initializeData: (callbacks) => {
      // 首先尝试从 localStorage 加载
      const savedData = get().loadFromLocalStorage();

      if (savedData) {
        // 如果有保存的数据，使用保存的数据
        callbacks.setNotes(savedData.notes);
        callbacks.setFolders(savedData.folders);
        callbacks.setTags(savedData.tags);
      } else {
        // 如果没有保存的数据，使用模拟数据
        const processedNotes = mockData.notes.map((note) => ({
          ...note,
          isDeleted: Boolean(note.isDeleted)
        }));
        const processedFolders = mockData.folders.map((folder) => ({
          ...folder,
          isDeleted: Boolean(folder.isDeleted)
        }));

        callbacks.setNotes(processedNotes);
        callbacks.setFolders(processedFolders);
        callbacks.setTags([...mockData.tags]);

        // 保存初始数据到 localStorage
        get().saveToLocalStorage({
          notes: processedNotes,
          folders: processedFolders,
          tags: mockData.tags
        });
      }

      set((state) => {
        state.isInitialized = true;
      });
    },

    loadFromLocalStorage: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        const data = JSON.parse(saved);
        if (data.version !== STORAGE_VERSION) {
          console.warn("数据版本不匹配，使用默认数据");
          return null;
        }

        // 恢复数据时需要将日期字符串转换为 Date 对象
        const notes: Note[] = data.notes.map((note: Note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
          lastViewedAt: note.lastViewedAt ? new Date(note.lastViewedAt) : undefined,
          isDeleted: note.isDeleted === true
        }));

        const folders: Folder[] = data.folders.map((folder: Folder) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
          updatedAt: new Date(folder.updatedAt)
        }));

        const tags: Tag[] = data.tags.map((tag: Tag) => ({
          ...tag,
          createdAt: new Date(tag.createdAt),
          updatedAt: new Date(tag.updatedAt)
        }));

        return { notes, folders, tags };
      } catch (error) {
        console.error("加载本地数据失败:", error);
        return null;
      }
    },

    saveToLocalStorage: (data) => {
      try {
        const saveData = {
          version: STORAGE_VERSION,
          notes: data.notes,
          folders: data.folders,
          tags: data.tags,
          savedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      } catch (error) {
        console.error("保存数据到本地失败:", error);
        throw new Error("保存数据失败");
      }
    },

    resetData: (callbacks) => {
      const processedNotes = mockData.notes.map((note) => ({
        ...note,
        isDeleted: Boolean(note.isDeleted)
      }));
      const processedFolders = mockData.folders.map((folder) => ({
        ...folder,
        isDeleted: Boolean(folder.isDeleted)
      }));

      callbacks.setNotes(processedNotes);
      callbacks.setFolders(processedFolders);
      callbacks.setTags([...mockData.tags]);

      get().saveToLocalStorage({
        notes: processedNotes,
        folders: processedFolders,
        tags: mockData.tags
      });
    }
  }))
);
