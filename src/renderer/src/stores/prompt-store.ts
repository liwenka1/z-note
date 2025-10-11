import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Prompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptState {
  // 状态
  prompts: Prompt[];
  currentPrompt: Prompt | null;

  // Actions
  loadPrompts: () => void;
  addPrompt: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  setCurrentPrompt: (id: string) => void;
  getCurrentPrompt: () => Prompt | null;
}

// 默认 prompts
const DEFAULT_PROMPTS: Omit<Prompt, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "通用助手",
    content: "你是一个有用的AI助手，请根据用户的问题提供准确、有帮助的回答。",
    description: "适用于一般性对话和问答",
    isDefault: true
  },
  {
    name: "代码助手",
    content: "你是一个专业的编程助手，擅长各种编程语言和开发技术。请提供清晰、准确的代码建议和解释。",
    description: "专门用于编程相关的任务",
    isDefault: true
  },
  {
    name: "写作助手",
    content: "你是一个专业的写作助手，擅长各种文体和写作技巧。请帮助用户改进文本质量，提供写作建议。",
    description: "用于写作和文本优化",
    isDefault: true
  }
];

export const usePromptStore = create<PromptState>()(
  persist(
    immer((set, get) => ({
      prompts: [],
      currentPrompt: null,

      loadPrompts: () => {
        set((state) => {
          // 如果是首次加载且没有数据，初始化默认 prompts
          if (state.prompts.length === 0) {
            const now = new Date().toISOString();
            const defaultPrompts: Prompt[] = DEFAULT_PROMPTS.map((prompt, index) => ({
              ...prompt,
              id: `default_${index}`,
              createdAt: now,
              updatedAt: now
            }));

            state.prompts = defaultPrompts;
            state.currentPrompt = defaultPrompts[0] || null;
          } else {
            // 设置当前选中的 prompt
            state.currentPrompt = state.prompts.find((p) => p.isDefault) || state.prompts[0] || null;
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
            createdAt: now,
            updatedAt: now
          };

          state.prompts.push(newPrompt);
        });
      },

      updatePrompt: (id, updates) => {
        set((state) => {
          const now = new Date().toISOString();

          const promptIndex = state.prompts.findIndex((prompt) => prompt.id === id);
          if (promptIndex !== -1) {
            Object.assign(state.prompts[promptIndex], updates, { updatedAt: now });
          }

          if (state.currentPrompt?.id === id) {
            Object.assign(state.currentPrompt, updates, { updatedAt: now });
          }
        });
      },

      deletePrompt: (id) => {
        set((state) => {
          const promptToDelete = state.prompts.find((p) => p.id === id);

          // 保护默认 prompts，不允许删除
          if (promptToDelete?.isDefault) {
            return;
          }

          const promptIndex = state.prompts.findIndex((p) => p.id === id);
          if (promptIndex !== -1) {
            state.prompts.splice(promptIndex, 1);
          }

          if (state.currentPrompt?.id === id) {
            state.currentPrompt = state.prompts.find((p) => p.isDefault) || state.prompts[0] || null;
          }
        });
      },

      setCurrentPrompt: (id) => {
        set((state) => {
          const prompt = state.prompts.find((p) => p.id === id);
          state.currentPrompt = prompt || null;
        });
      },

      getCurrentPrompt: () => {
        return get().currentPrompt;
      }
    })),
    {
      name: "prompt-storage",
      partialize: (state) => ({
        prompts: state.prompts,
        currentPrompt: state.currentPrompt
      })
    }
  )
);
