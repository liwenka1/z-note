import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ==================== UI加载状态类型 ====================
interface LoadingState {
  isLoading: boolean;
  error?: string;
}

interface LoadingActions {
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
}

type LoadingStore = LoadingState & LoadingActions;

// ==================== Store 实现 ====================
export const useLoadingStore = create<LoadingStore>()(
  immer((set) => ({
    // ==================== 初始状态 ====================
    isLoading: false,
    error: undefined,

    // ==================== 加载状态管理 ====================
    setLoading: (loading: boolean) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error?: string) => {
      set((state) => {
        state.error = error;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = undefined;
      });
    }
  }))
);
