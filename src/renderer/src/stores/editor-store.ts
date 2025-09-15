import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { JSONContent } from "@tiptap/react";

// 编辑器状态接口
interface EditorState {
  // 当前正在编辑的笔记内容（按noteId存储）
  editingContent: Record<string, JSONContent>;
  // 原始内容（用于对比是否修改）
  originalContent: Record<string, JSONContent>;
}

interface EditorActions {
  // 开始编辑笔记
  startEditing: (noteId: string, content: JSONContent) => void;
  // 更新编辑内容
  updateContent: (noteId: string, content: JSONContent) => void;
  // 保存笔记
  saveNote: (noteId: string) => void;
  // 停止编辑（关闭标签时调用）
  stopEditing: (noteId: string) => void;
  // 检查笔记是否被修改
  isNoteModified: (noteId: string) => boolean;
  // 获取笔记的编辑内容
  getEditingContent: (noteId: string) => JSONContent | undefined;
  // 重置笔记到原始状态
  resetNote: (noteId: string) => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Initial state
    editingContent: {},
    originalContent: {},

    // Actions
    startEditing: (noteId: string, content: JSONContent) => {
      set((state) => {
        // 设置原始内容和当前编辑内容
        state.originalContent[noteId] = content;
        state.editingContent[noteId] = content;
      });
    },

    updateContent: (noteId: string, content: JSONContent) => {
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

      // 比较 JSON 内容
      return JSON.stringify(original) !== JSON.stringify(current);
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
      });
    }
  }))
);

// 导出类型供组件使用
export type { EditorStore };
