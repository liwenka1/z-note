import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Tab {
  id: string;
  title: string;
  type: "note" | "settings";
  isModified?: boolean;
}

interface TabState {
  openTabs: Tab[];
  activeTabId: string | null;
}

interface TabActions {
  openTab: (noteId: string, title: string, type?: "note" | "settings") => void;
  openSettingsTab: () => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (keepTabId: string) => void;
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
            type,
            isModified: false
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

    openSettingsTab: () => {
      set((state) => {
        const settingsTabId = "settings";
        const existingTab = state.openTabs.find((tab) => tab.id === settingsTabId);

        if (!existingTab) {
          // Add settings tab
          state.openTabs.push({
            id: settingsTabId,
            title: "设置",
            type: "settings",
            isModified: false
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
