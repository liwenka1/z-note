import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 编辑器主题
type EditorTheme = "dark" | "light";

// 编辑器设置
interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  theme: EditorTheme;
}

// 功能设置
interface FeatureSettings {
  mathSupport: boolean;
  mermaidSupport: boolean;
  codeHighlight: boolean;
}

// 编辑器状态接口
interface EditorState {
  // 当前正在编辑的笔记内容（按noteId存储）
  editingContent: Record<string, string>;
  // 原始内容（用于对比是否修改）
  originalContent: Record<string, string>;
  // 自动保存定时器
  autoSaveTimers: Record<string, NodeJS.Timeout>;

  // 设置
  editorSettings: EditorSettings;
  featureSettings: FeatureSettings;
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

  // 设置相关 actions
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  updateFeatureSettings: (settings: Partial<FeatureSettings>) => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Initial state
    editingContent: {},
    originalContent: {},
    autoSaveTimers: {},

    // 默认设置
    editorSettings: {
      fontSize: 14,
      wordWrap: true,
      theme: "dark" as EditorTheme
    },
    featureSettings: {
      mathSupport: true,
      mermaidSupport: true,
      codeHighlight: true
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

    // 设置 actions
    updateEditorSettings: (settings: Partial<EditorSettings>) => {
      set((state) => {
        Object.assign(state.editorSettings, settings);
      });
    },

    updateFeatureSettings: (settings: Partial<FeatureSettings>) => {
      set((state) => {
        Object.assign(state.featureSettings, settings);
      });
    }
  }))
);

// 导出类型供组件使用
export type { EditorStore };
