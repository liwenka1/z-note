import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 编辑器视图模式
type ViewMode = "edit" | "preview" | "split";

// 编辑器主题
type EditorTheme = "vs-dark" | "vs-light";

// 预览主题
type PreviewTheme = "github" | "dark";

// 编辑器设置
interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  theme: EditorTheme;
  tabSize: number;
}

// 预览设置
interface PreviewSettings {
  theme: PreviewTheme;
  mathSupport: boolean;
  mermaidSupport: boolean;
  codeHighlight: boolean;
  showLineNumbers: boolean;
}

// 编辑器状态接口
interface EditorState {
  // 当前正在编辑的笔记内容（按noteId存储）
  editingContent: Record<string, string>;
  // 原始内容（用于对比是否修改）
  originalContent: Record<string, string>;
  // 自动保存定时器
  autoSaveTimers: Record<string, NodeJS.Timeout>;

  // 新增：视图模式和设置
  viewMode: ViewMode;
  splitRatio: number; // 分屏比例 0-1
  syncScroll: boolean; // 是否同步滚动
  editorSettings: EditorSettings;
  previewSettings: PreviewSettings;
}

interface EditorActions {
  // 开始编辑笔记
  startEditing: (noteId: string, content: string) => void;
  // 更新编辑内容
  updateContent: (noteId: string, content: string) => void;
  // 保存笔记
  saveNote: (noteId: string) => void;
  // 停止编辑（关闭标签时调用）
  stopEditing: (noteId: string) => void;
  // 检查笔记是否被修改
  isNoteModified: (noteId: string) => boolean;
  // 获取笔记的编辑内容
  getEditingContent: (noteId: string) => string | undefined;
  // 重置笔记到原始状态
  resetNote: (noteId: string) => void;

  // 新增：视图和设置相关 actions
  setViewMode: (mode: ViewMode) => void;
  setSplitRatio: (ratio: number) => void;
  toggleSyncScroll: () => void;
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  updatePreviewSettings: (settings: Partial<PreviewSettings>) => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Initial state
    editingContent: {},
    originalContent: {},
    autoSaveTimers: {},

    // 新增默认状态
    viewMode: "edit" as ViewMode,
    splitRatio: 0.5,
    syncScroll: true,
    editorSettings: {
      fontSize: 14,
      wordWrap: true,
      minimap: true,
      lineNumbers: true,
      theme: "vs-dark" as EditorTheme,
      tabSize: 2
    },
    previewSettings: {
      theme: "github" as PreviewTheme,
      mathSupport: true,
      mermaidSupport: true,
      codeHighlight: true,
      showLineNumbers: true
    },

    // Actions
    startEditing: (noteId: string, content: string) => {
      set((state) => {
        // 设置原始内容和当前编辑内容
        state.originalContent[noteId] = content;
        state.editingContent[noteId] = content;
      });
    },

    updateContent: (noteId: string, content: string) => {
      set((state) => {
        // 只更新编辑内容，不设置自动保存
        state.editingContent[noteId] = content;
      });
    },

    saveNote: (noteId: string) => {
      set((state) => {
        const content = state.editingContent[noteId];
        if (content !== undefined) {
          // 更新原始内容为当前内容，标记为已保存
          state.originalContent[noteId] = content;
        }
      });
    },

    stopEditing: (noteId: string) => {
      set((state) => {
        // 删除编辑状态
        delete state.editingContent[noteId];
        delete state.originalContent[noteId];
        // 清除自动保存定时器（如果有的话）
        if (state.autoSaveTimers[noteId]) {
          clearTimeout(state.autoSaveTimers[noteId]);
          delete state.autoSaveTimers[noteId];
        }
      });
    },

    isNoteModified: (noteId: string) => {
      const state = get();
      const original = state.originalContent[noteId];
      const current = state.editingContent[noteId];

      // 如果没有编辑状态，说明没有修改
      if (original === undefined || current === undefined) {
        return false;
      }

      return original !== current;
    },

    getEditingContent: (noteId: string) => {
      const state = get();
      return state.editingContent[noteId];
    },

    resetNote: (noteId: string) => {
      set((state) => {
        const original = state.originalContent[noteId];
        if (original !== undefined) {
          state.editingContent[noteId] = original;
        }

        // 清除自动保存定时器
        if (state.autoSaveTimers[noteId]) {
          clearTimeout(state.autoSaveTimers[noteId]);
          delete state.autoSaveTimers[noteId];
        }
      });
    },

    // 新增 actions
    setViewMode: (mode: ViewMode) => {
      set((state) => {
        state.viewMode = mode;
      });
    },

    setSplitRatio: (ratio: number) => {
      set((state) => {
        state.splitRatio = Math.max(0.1, Math.min(0.9, ratio));
      });
    },

    toggleSyncScroll: () => {
      set((state) => {
        state.syncScroll = !state.syncScroll;
      });
    },

    updateEditorSettings: (settings: Partial<EditorSettings>) => {
      set((state) => {
        Object.assign(state.editorSettings, settings);
      });
    },

    updatePreviewSettings: (settings: Partial<PreviewSettings>) => {
      set((state) => {
        Object.assign(state.previewSettings, settings);
      });
    }
  }))
);

// 导出类型供组件使用
export type { EditorStore };
