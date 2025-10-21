import { create } from "zustand";
import type { Editor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";

// 编辑器实例信息
interface EditorInstance {
  editor: Editor;
  originalContent: JSONContent;
}

// 编辑器状态接口
interface EditorState {
  // 实例池：noteId -> 编辑器实例
  instances: Map<string, EditorInstance>;
  // 当前激活的笔记 ID
  activeNoteId: string | null;
  // 内容版本号：用于触发 React 重新渲染
  contentVersion: number;
}

interface EditorActions {
  // 注册编辑器实例
  registerEditor: (noteId: string, editor: Editor, initialContent: JSONContent) => void;
  // 注销编辑器实例（关闭 tab 时）
  unregisterEditor: (noteId: string) => void;
  // 设置激活的笔记
  setActiveNote: (noteId: string) => void;
  // 获取编辑器实例
  getEditor: (noteId: string) => Editor | undefined;
  // 检查笔记是否被修改
  isNoteModified: (noteId: string) => boolean;
  // 保存笔记（更新原始内容）
  saveNote: (noteId: string) => void;
  // 获取笔记当前内容
  getNoteContent: (noteId: string) => JSONContent | undefined;
  // 通知内容已更新（触发重新渲染）
  notifyContentChanged: () => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()((set, get) => ({
  // Initial state
  instances: new Map(),
  activeNoteId: null,
  contentVersion: 0,

  // Actions
  registerEditor: (noteId: string, editor: Editor, initialContent: JSONContent) => {
    set((state) => {
      const newInstances = new Map(state.instances);
      newInstances.set(noteId, {
        editor,
        originalContent: structuredClone(initialContent)
      });
      return { instances: newInstances };
    });
  },

  unregisterEditor: (noteId: string) => {
    const instance = get().instances.get(noteId);
    if (instance) {
      // 销毁编辑器实例
      instance.editor.destroy();
      set((state) => {
        const newInstances = new Map(state.instances);
        newInstances.delete(noteId);
        return { instances: newInstances };
      });
    }
  },

  setActiveNote: (noteId: string) => {
    set({ activeNoteId: noteId });
  },

  getEditor: (noteId: string) => {
    return get().instances.get(noteId)?.editor;
  },

  isNoteModified: (noteId: string) => {
    const state = get();
    const instance = state.instances.get(noteId);

    if (!instance) {
      return false;
    }

    const current = instance.editor.getJSON();
    return JSON.stringify(current) !== JSON.stringify(instance.originalContent);
  },

  saveNote: (noteId: string) => {
    const instance = get().instances.get(noteId);
    if (instance) {
      const content = instance.editor.getJSON();
      set((state) => {
        const newInstances = new Map(state.instances);
        const updatedInstance = newInstances.get(noteId);
        if (updatedInstance) {
          updatedInstance.originalContent = structuredClone(content);
        }
        return { instances: newInstances };
      });
    }
  },

  getNoteContent: (noteId: string) => {
    const instance = get().instances.get(noteId);
    return instance?.editor.getJSON();
  },

  notifyContentChanged: () => {
    set((state) => ({
      contentVersion: state.contentVersion + 1
    }));
  }
}));

// 导出类型供组件使用
export type { EditorStore };
