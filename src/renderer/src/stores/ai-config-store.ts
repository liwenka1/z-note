import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AIConfig {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "custom";
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isDefault: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  displayName: string;
  baseURL: string;
  models: string[];
  defaultModel: string;
}

// 预设服务商
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    displayName: "OpenAI GPT",
    baseURL: "https://api.openai.com/v1",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    defaultModel: "gpt-4"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    displayName: "Claude",
    baseURL: "https://api.anthropic.com/v1",
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
    defaultModel: "claude-3-sonnet"
  },
  {
    id: "custom",
    name: "Custom",
    displayName: "自定义",
    baseURL: "",
    models: [],
    defaultModel: ""
  }
];

interface AIConfigState {
  // 状态
  configs: AIConfig[];
  currentConfig: AIConfig | null;

  // Actions
  loadConfigs: () => void;
  addConfig: (config: Omit<AIConfig, "id">) => void;
  updateConfig: (id: string, updates: Partial<AIConfig>) => void;
  deleteConfig: (id: string) => void;
  setDefaultConfig: (id: string) => void;
  getCurrentConfig: () => AIConfig | null;
  hasAnyConfig: () => boolean;
}

export const useAIConfigStore = create<AIConfigState>()(
  persist(
    (set, get) => ({
      configs: [],
      currentConfig: null,

      loadConfigs: () => {
        const { configs } = get();
        const defaultConfig = configs.find((c) => c.isDefault) || configs[0] || null;
        set({ currentConfig: defaultConfig });
      },

      addConfig: (configData) => {
        const id = `config_${Date.now()}`;
        const isFirstConfig = get().configs.length === 0;

        const newConfig: AIConfig = {
          ...configData,
          id,
          isDefault: isFirstConfig
        };

        set((state) => {
          const configs = [...state.configs, newConfig];
          return {
            configs,
            currentConfig: isFirstConfig ? newConfig : state.currentConfig
          };
        });
      },

      updateConfig: (id, updates) => {
        set((state) => {
          const configs = state.configs.map((config) => (config.id === id ? { ...config, ...updates } : config));

          const currentConfig =
            state.currentConfig?.id === id ? { ...state.currentConfig, ...updates } : state.currentConfig;

          return { configs, currentConfig };
        });
      },

      deleteConfig: (id) => {
        set((state) => {
          const configs = state.configs.filter((c) => c.id !== id);
          const currentConfig =
            state.currentConfig?.id === id
              ? configs.find((c) => c.isDefault) || configs[0] || null
              : state.currentConfig;

          return { configs, currentConfig };
        });
      },

      setDefaultConfig: (id) => {
        set((state) => {
          const configs = state.configs.map((config) => ({
            ...config,
            isDefault: config.id === id
          }));

          const currentConfig = configs.find((c) => c.id === id) || state.currentConfig;

          return { configs, currentConfig };
        });
      },

      getCurrentConfig: () => {
        return get().currentConfig;
      },

      hasAnyConfig: () => {
        return get().configs.length > 0;
      }
    }),
    {
      name: "ai-config-storage",
      partialize: (state) => ({
        configs: state.configs,
        currentConfig: state.currentConfig
      })
    }
  )
);
