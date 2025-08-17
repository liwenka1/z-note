import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Tag, CreateTagInput, UpdateTagInput } from "@renderer/types";

// ==================== 标签状态类型 ====================
interface TagsState {
  tags: Tag[];
}

interface TagsActions {
  // ==================== 标签操作 ====================
  createTag: (input: CreateTagInput) => string;
  updateTag: (id: string, updates: UpdateTagInput) => void;
  deleteTag: (id: string) => void;
  addTagToNote: (noteId: string, tagId: string) => void;
  removeTagFromNote: (noteId: string, tagId: string) => void;
  updateTagUsage: (tagId: string, increment: boolean) => void;

  // ==================== 查询方法 ====================
  getTagById: (id: string) => Tag | undefined;
  getAllTags: () => Tag[];
  getTagsByUsage: () => Tag[];
  searchTags: (query: string) => Tag[];

  // ==================== 数据管理 ====================
  setTags: (tags: Tag[]) => void;
  clearTags: () => void;
}

type TagsStore = TagsState & TagsActions;

// ==================== Store 实现 ====================
export const useTagsStore = create<TagsStore>()(
  immer((set, get) => ({
    // ==================== 初始状态 ====================
    tags: [],

    // ==================== 标签操作 ====================
    createTag: (input: CreateTagInput) => {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        ...input,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set((state) => {
        state.tags.push(newTag);
      });

      return newTag.id;
    },

    updateTag: (id: string, updates: UpdateTagInput) => {
      set((state) => {
        const tagIndex = state.tags.findIndex((t) => t.id === id);
        if (tagIndex !== -1) {
          Object.assign(state.tags[tagIndex], {
            ...updates,
            updatedAt: new Date()
          });
        }
      });
    },

    deleteTag: (id: string) => {
      set((state) => {
        state.tags = state.tags.filter((t) => t.id !== id);
      });
    },

    addTagToNote: (_noteId: string, tagId: string) => {
      // 这个方法会被组合store调用，用于更新标签使用计数
      get().updateTagUsage(tagId, true);
    },

    removeTagFromNote: (_noteId: string, tagId: string) => {
      // 这个方法会被组合store调用，用于更新标签使用计数
      get().updateTagUsage(tagId, false);
    },

    updateTagUsage: (tagId: string, increment: boolean) => {
      set((state) => {
        const tag = state.tags.find((t) => t.id === tagId);
        if (tag) {
          if (increment) {
            tag.usageCount++;
          } else if (tag.usageCount > 0) {
            tag.usageCount--;
          }
          tag.updatedAt = new Date();
        }
      });
    },

    // ==================== 查询方法 ====================
    getTagById: (id: string) => {
      return get().tags.find((tag) => tag.id === id);
    },

    getAllTags: () => {
      return get().tags;
    },

    getTagsByUsage: () => {
      return [...get().tags].sort((a, b) => b.usageCount - a.usageCount);
    },

    searchTags: (query: string) => {
      if (!query.trim()) return get().tags;

      const searchQuery = query.toLowerCase();
      return get().tags.filter(
        (tag) => tag.name.toLowerCase().includes(searchQuery) || tag.description?.toLowerCase().includes(searchQuery)
      );
    },

    // ==================== 数据管理 ====================
    setTags: (tags: Tag[]) => {
      set((state) => {
        state.tags = tags;
      });
    },

    clearTags: () => {
      set((state) => {
        state.tags = [];
      });
    }
  }))
);
