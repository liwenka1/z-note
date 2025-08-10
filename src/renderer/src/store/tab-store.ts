import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Tab {
  id: string;
  title: string;
  isModified?: boolean;
  isDirty?: boolean;
}

interface TabState {
  openTabs: Tab[];
  activeTabId: string | null;
}

interface TabActions {
  openTab: (noteId: string, title: string) => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (keepTabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabTitle: (tabId: string, title: string) => void;
  markTabModified: (tabId: string, isModified: boolean) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

type TabStore = TabState & TabActions;

export const useTabStore = create<TabStore>()(
  immer((set) => ({
    // Initial state
    openTabs: [],
    activeTabId: null,

    // Actions
    openTab: (noteId: string, title: string) => {
      set((state) => {
        // Check if tab already exists
        const existingTab = state.openTabs.find((tab) => tab.id === noteId);

        if (!existingTab) {
          // Add new tab
          state.openTabs.push({
            id: noteId,
            title,
            isModified: false,
            isDirty: false
          });
        } else {
          // Update existing tab title if needed
          existingTab.title = title;
        }

        // Set as active tab
        state.activeTabId = noteId;
      });
    },

    closeTab: (tabId: string) => {
      set((state) => {
        const tabIndex = state.openTabs.findIndex((tab) => tab.id === tabId);

        if (tabIndex !== -1) {
          state.openTabs.splice(tabIndex, 1);

          // If closing active tab, set new active tab
          if (state.activeTabId === tabId) {
            if (state.openTabs.length > 0) {
              // Set the tab to the right, or the last tab if this was the rightmost
              const newActiveIndex = Math.min(tabIndex, state.openTabs.length - 1);
              state.activeTabId = state.openTabs[newActiveIndex]?.id || null;
            } else {
              state.activeTabId = null;
            }
          }
        }
      });
    },

    closeAllTabs: () => {
      set((state) => {
        state.openTabs = [];
        state.activeTabId = null;
      });
    },

    closeOtherTabs: (keepTabId: string) => {
      set((state) => {
        const keepTab = state.openTabs.find((tab) => tab.id === keepTabId);
        if (keepTab) {
          state.openTabs = [keepTab];
          state.activeTabId = keepTabId;
        }
      });
    },

    setActiveTab: (tabId: string) => {
      set((state) => {
        // Only set if tab exists
        const tabExists = state.openTabs.some((tab) => tab.id === tabId);
        if (tabExists) {
          state.activeTabId = tabId;
        }
      });
    },

    updateTabTitle: (tabId: string, title: string) => {
      set((state) => {
        const tab = state.openTabs.find((t) => t.id === tabId);
        if (tab) {
          tab.title = title;
        }
      });
    },

    markTabModified: (tabId: string, isModified: boolean) => {
      set((state) => {
        const tab = state.openTabs.find((t) => t.id === tabId);
        if (tab) {
          tab.isModified = isModified;
          tab.isDirty = isModified;
        }
      });
    },

    reorderTabs: (fromIndex: number, toIndex: number) => {
      set((state) => {
        if (fromIndex >= 0 && fromIndex < state.openTabs.length && toIndex >= 0 && toIndex < state.openTabs.length) {
          const [movedTab] = state.openTabs.splice(fromIndex, 1);
          state.openTabs.splice(toIndex, 0, movedTab);
        }
      });
    }
  }))
);
