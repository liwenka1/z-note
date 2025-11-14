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

// 辅助函数：处理关闭 tab 后设置新激活 tab
const setNewActiveTabAfterClose = (state: TabState, closedTabId: string, closedTabIndex: number) => {
  if (state.activeTabId === closedTabId) {
    if (state.openTabs.length > 0) {
      const newActiveIndex = Math.min(closedTabIndex, state.openTabs.length - 1);
      state.activeTabId = state.openTabs[newActiveIndex]?.id || null;
    } else {
      state.activeTabId = null;
    }
  }
};

export const useTabStore = create<TabStore>()(
  immer((set) => ({
    // Initial state
    openTabs: [],
    activeTabId: null,

    // Actions
    openTab: (noteId: string, title: string, type: "note" | "settings" = "note") => {
      set((state) => {
        const existingTab = state.openTabs.find((tab) => tab.id === noteId);

        if (!existingTab) {
          state.openTabs.push({ id: noteId, title, type });
        } else {
          existingTab.title = title;
          existingTab.type = type;
        }

        state.activeTabId = noteId;
      });
    },

    openTagTab: (tagId: number, tagName: string) => {
      set((state) => {
        const tabId = `tag-${tagId}`;
        const existingTab = state.openTabs.find((tab) => tab.id === tabId);

        if (!existingTab) {
          state.openTabs.push({ id: tabId, title: tagName, type: "tag", tagId });
        } else {
          existingTab.title = tagName;
        }

        state.activeTabId = tabId;
      });
    },

    openSettingsTab: () => {
      set((state) => {
        const settingsTabId = "settings";
        const existingTab = state.openTabs.find((tab) => tab.id === settingsTabId);

        if (!existingTab) {
          state.openTabs.push({ id: settingsTabId, title: "设置", type: "settings" });
        }

        state.activeTabId = settingsTabId;
      });
    },

    closeTab: (tabId: string) => {
      set((state) => {
        const tabIndex = state.openTabs.findIndex((tab) => tab.id === tabId);

        if (tabIndex !== -1) {
          state.openTabs.splice(tabIndex, 1);
          setNewActiveTabAfterClose(state, tabId, tabIndex);
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
            setNewActiveTabAfterClose(state, tab.id, tabIndex);
          }
        });
      });
    },

    setActiveTab: (tabId: string) => {
      set((state) => {
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
        const isValidRange = (index: number) => index >= 0 && index < state.openTabs.length;

        if (isValidRange(fromIndex) && isValidRange(toIndex)) {
          const [movedTab] = state.openTabs.splice(fromIndex, 1);
          state.openTabs.splice(toIndex, 0, movedTab);
        }
      });
    }
  }))
);
