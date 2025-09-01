import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ==================== 加载状态类型 ====================
interface LoadingState {
  // 全局加载状态
  isGlobalLoading: boolean;

  // 特定操作的加载状态
  operationLoading: Record<string, boolean>;

  // 错误状态
  globalError?: string;
  operationErrors: Record<string, string>;
}

interface LoadingActions {
  // ==================== 全局加载状态 ====================
  setGlobalLoading: (loading: boolean) => void;

  // ==================== 操作加载状态 ====================
  setOperationLoading: (operation: string, loading: boolean) => void;
  clearOperationLoading: (operation: string) => void;
  clearAllOperationLoading: () => void;

  // ==================== 错误状态管理 ====================
  setGlobalError: (error?: string) => void;
  clearGlobalError: () => void;
  setOperationError: (operation: string, error: string) => void;
  clearOperationError: (operation: string) => void;
  clearAllErrors: () => void;
}

type LoadingStore = LoadingState & LoadingActions;

// ==================== Store 实现 ====================
export const useLoadingStore = create<LoadingStore>()(
  immer((set) => ({
    // ==================== 初始状态 ====================
    isGlobalLoading: false,
    operationLoading: {},
    globalError: undefined,
    operationErrors: {},

    // ==================== 全局加载状态 ====================
    setGlobalLoading: (loading: boolean) => {
      set((state) => {
        state.isGlobalLoading = loading;
      });
    },

    // ==================== 操作加载状态 ====================
    setOperationLoading: (operation: string, loading: boolean) => {
      set((state) => {
        if (loading) {
          state.operationLoading[operation] = true;
        } else {
          delete state.operationLoading[operation];
        }
      });
    },

    clearOperationLoading: (operation: string) => {
      set((state) => {
        delete state.operationLoading[operation];
      });
    },

    clearAllOperationLoading: () => {
      set((state) => {
        state.operationLoading = {};
      });
    },

    // ==================== 错误状态管理 ====================
    setGlobalError: (error?: string) => {
      set((state) => {
        state.globalError = error;
      });
    },

    clearGlobalError: () => {
      set((state) => {
        state.globalError = undefined;
      });
    },

    setOperationError: (operation: string, error: string) => {
      set((state) => {
        state.operationErrors[operation] = error;
      });
    },

    clearOperationError: (operation: string) => {
      set((state) => {
        delete state.operationErrors[operation];
      });
    },

    clearAllErrors: () => {
      set((state) => {
        state.globalError = undefined;
        state.operationErrors = {};
      });
    }
  }))
);

// 导出类型供组件使用
export type { LoadingStore };
