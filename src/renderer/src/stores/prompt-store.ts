import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Prompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  isBuiltIn: boolean; // 是否是系统内置的（不可编辑、不可删除）
  createdAt: string;
  updatedAt: string;
}

interface PromptState {
  // 状态
  prompts: Prompt[];
  currentPromptId: string | null; // 只存储 ID，不存整个对象

  // Actions
  loadPrompts: () => void;
  addPrompt: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt" | "isBuiltIn">) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  setCurrentPrompt: (id: string) => void;
  getCurrentPrompt: () => Prompt | null;
  canEdit: (id: string) => boolean; // 检查是否可编辑
  canDelete: (id: string) => boolean; // 检查是否可删除
  duplicatePrompt: (id: string) => void; // 复制 prompt（用于复制内置的）
}

// 系统内置 prompts（不可编辑、不可删除）
const BUILT_IN_PROMPTS: Omit<Prompt, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "通用助手",
    content: "你是一个有用的AI助手，请根据用户的问题提供准确、有帮助的回答。",
    description: "适用于一般性对话和问答",
    isBuiltIn: true
  },
  {
    name: "代码助手",
    content: "你是一个专业的编程助手，擅长各种编程语言和开发技术。请提供清晰、准确的代码建议和解释。",
    description: "专门用于编程相关的任务",
    isBuiltIn: true
  },
  {
    name: "写作助手",
    content: "你是一个专业的写作助手，擅长各种文体和写作技巧。请帮助用户改进文本质量，提供写作建议。",
    description: "用于写作和文本优化",
    isBuiltIn: true
  }
];

export const usePromptStore = create<PromptState>()(
  persist(
    immer((set, get) => ({
      prompts: [],
      currentPromptId: null,

      loadPrompts: () => {
        set((state) => {
          // 如果是首次加载且没有数据，初始化内置 prompts
          if (state.prompts.length === 0) {
            const now = new Date().toISOString();
            const builtInPrompts: Prompt[] = BUILT_IN_PROMPTS.map((prompt, index) => ({
              ...prompt,
              id: `builtin_${index}`,
              createdAt: now,
              updatedAt: now
            }));

            state.prompts = builtInPrompts;
            // 默认选中第一个内置 prompt
            state.currentPromptId = builtInPrompts[0]?.id || null;
          } else {
            // 如果没有选中的，默认选中第一个
            if (!state.currentPromptId) {
              state.currentPromptId = state.prompts[0]?.id || null;
            }
          }
        });
      },

      addPrompt: (promptData) => {
        set((state) => {
          const id = `prompt_${Date.now()}`;
          const now = new Date().toISOString();

          const newPrompt: Prompt = {
            ...promptData,
            id,
            isBuiltIn: false, // 用户添加的都不是内置的
            createdAt: now,
            updatedAt: now
          };

          state.prompts.push(newPrompt);
        });
      },

      updatePrompt: (id, updates) => {
        set((state) => {
          const prompt = state.prompts.find((p) => p.id === id);

          // 内置的不允许编辑
          if (prompt?.isBuiltIn) {
            console.warn("内置 prompt 不可编辑");
            return;
          }

          const now = new Date().toISOString();
          const promptIndex = state.prompts.findIndex((p) => p.id === id);
          if (promptIndex !== -1) {
            Object.assign(state.prompts[promptIndex], updates, { updatedAt: now });
          }
        });
      },

      deletePrompt: (id) => {
        set((state) => {
          const promptToDelete = state.prompts.find((p) => p.id === id);

          // 内置的不允许删除
          if (promptToDelete?.isBuiltIn) {
            console.warn("内置 prompt 不可删除");
            return;
          }

          const promptIndex = state.prompts.findIndex((p) => p.id === id);
          if (promptIndex !== -1) {
            state.prompts.splice(promptIndex, 1);
          }

          // 如果删除的是当前选中的，切换到第一个
          if (state.currentPromptId === id) {
            state.currentPromptId = state.prompts[0]?.id || null;
          }
        });
      },

      setCurrentPrompt: (id) => {
        set((state) => {
          const prompt = state.prompts.find((p) => p.id === id);
          if (prompt) {
            state.currentPromptId = id;
          }
        });
      },

      getCurrentPrompt: () => {
        const { prompts, currentPromptId } = get();
        return prompts.find((p) => p.id === currentPromptId) || null;
      },

      canEdit: (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        return prompt ? !prompt.isBuiltIn : false;
      },

      canDelete: (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        return prompt ? !prompt.isBuiltIn : false;
      },

      duplicatePrompt: (id) => {
        set((state) => {
          const sourcePro = state.prompts.find((p) => p.id === id);
          if (!sourcePro) return;

          const now = new Date().toISOString();
          const newId = `prompt_${Date.now()}`;

          const duplicated: Prompt = {
            ...sourcePro,
            id: newId,
            name: `${sourcePro.name} (副本)`,
            isBuiltIn: false, // 复制的都是用户自定义的
            createdAt: now,
            updatedAt: now
          };

          state.prompts.push(duplicated);
        });
      }
    })),
    {
      name: "prompt-storage",
      partialize: (state) => ({
        prompts: state.prompts,
        currentPromptId: state.currentPromptId
      })
    }
  )
);
