/**
 * Chat标签关联状态管理
 * 管理当前对话与标签的关联关系
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatTagState {
  // 当前对话关联的标签ID
  currentAssociatedTagId: number | null;

  // Actions
  setAssociatedTag: (tagId: number | null) => void;
  getAssociatedTag: () => number | null;
  clearAssociation: () => void;
}

export const useChatTagStore = create<ChatTagState>()(
  persist(
    (set, get) => ({
      currentAssociatedTagId: null,

      setAssociatedTag: (tagId: number | null) => {
        set({ currentAssociatedTagId: tagId });
      },

      getAssociatedTag: () => {
        return get().currentAssociatedTagId;
      },

      clearAssociation: () => {
        set({ currentAssociatedTagId: null });
      }
    }),
    {
      name: "chat-tag-association", // localStorage key
      partialize: (state) => ({
        currentAssociatedTagId: state.currentAssociatedTagId
      })
    }
  )
);
