import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Tab {
  id: string;
  title: string;
  type: "note" | "settings" | "tag";
  tagId?: number; // 对于tag类型的tab，存储tag的ID
}

interface TabState {
  openTabs: Tab[];
  activeTabId: string | null;
}

interface TabActions {
  openTab: (noteId: string, title: string, type?: "note" | "settings") => void;
  openTagTab: (tagId: number, tagName: string) => void;
  openSettingsTab: () => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (keepTabId: string) => void;
  closeTagTabs: (tagId: number) => void;
  setActiveTab: (tabId: string) => void;
  updateTabTitle: (tabId: string, title: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

type TabStore = TabState & TabActions;

export const useTabStore = create<TabStore>()(
  immer((set) => ({
    // Initial state
    openTabs: [],
    activeTabId: null,

    // Actions
    openTab: (noteId: string, title: string, type: "note" | "settings" = "note") => {
      set((state) => {
        // Check if tab already exists
        const existingTab = state.openTabs.find((tab) => tab.id === noteId);

        if (!existingTab) {
          // Add new tab
          state.openTabs.push({
            id: noteId,
            title,
            type
          });
        } else {
          // Update existing tab title if needed
          existingTab.title = title;
          existingTab.type = type;
        }

        // Set as active tab
        state.activeTabId = noteId;
      });
    },

    openTagTab: (tagId: number, tagName: string) => {
      set((state) => {
        const tabId = `tag-${tagId}`;
        // Check if tag tab already exists
        const existingTab = state.openTabs.find((tab) => tab.id === tabId);

        if (!existingTab) {
          // Add new tag tab
          state.openTabs.push({
            id: tabId,
            title: tagName,
            type: "tag",
            tagId: tagId
          });
        } else {
          // Update existing tab title if needed
          existingTab.title = tagName;
        }

        // Set as active tab
        state.activeTabId = tabId;
      });
    },

    openSettingsTab: () => {
      set((state) => {
        const settingsTabId = "settings";
        const existingTab = state.openTabs.find((tab) => tab.id === settingsTabId);

        if (!existingTab) {
          // Add settings tab
          state.openTabs.push({
            id: settingsTabId,
            title: "设置",
            type: "settings"
          });
        }

        // Set as active tab
        state.activeTabId = settingsTabId;
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

    closeTagTabs: (tagId: number) => {
      set((state) => {
        const tabsToClose = state.openTabs.filter((tab) => tab.type === "tag" && tab.tagId === tagId);

        tabsToClose.forEach((tab) => {
          const tabIndex = state.openTabs.findIndex((t) => t.id === tab.id);
          if (tabIndex !== -1) {
            state.openTabs.splice(tabIndex, 1);

            // If closing active tab, set new active tab
            if (state.activeTabId === tab.id) {
              if (state.openTabs.length > 0) {
                const newActiveIndex = Math.min(tabIndex, state.openTabs.length - 1);
                state.activeTabId = state.openTabs[newActiveIndex]?.id || null;
              } else {
                state.activeTabId = null;
              }
            }
          }
        });
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
