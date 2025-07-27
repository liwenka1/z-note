import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 状态结构，展示 Immer 的优势
interface CounterHistory {
  action: string;
  value: number;
  timestamp: string;
}

type State = {
  count: number;
  step: number;
  history: CounterHistory[];
  settings: {
    maxHistory: number;
  };
};

type Actions = {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setStep: (step: number) => void;
  clearHistory: () => void;
  updateMaxHistory: (max: number) => void;
};

export const useCounterStore = create<State & Actions, [["zustand/immer", never]]>(
  immer((set) => ({
    // 初始状态
    count: 0,
    step: 1,
    history: [],
    settings: {
      maxHistory: 5
    },

    // 😎 使用 Immer 直接修改，像 Vue 一样！
    increment: () =>
      set((state) => {
        state.count += state.step; // 😎 直接修改，像 Vue！

        // 添加历史记录
        state.history.unshift({
          action: `+${state.step}`,
          value: state.count,
          timestamp: new Date().toLocaleTimeString()
        });

        // 限制历史记录长度
        if (state.history.length > state.settings.maxHistory) {
          state.history.pop();
        }
      }),

    decrement: () =>
      set((state) => {
        state.count -= state.step; // 😎 直接修改！

        // 添加历史记录
        state.history.unshift({
          action: `-${state.step}`,
          value: state.count,
          timestamp: new Date().toLocaleTimeString()
        });

        // 限制历史记录长度
        if (state.history.length > state.settings.maxHistory) {
          state.history.pop();
        }
      }),

    reset: () =>
      set((state) => {
        state.count = 0; // 😎 直接修改！

        // 添加历史记录
        state.history.unshift({
          action: "reset",
          value: 0,
          timestamp: new Date().toLocaleTimeString()
        });

        // 限制历史记录长度
        if (state.history.length > state.settings.maxHistory) {
          state.history.pop();
        }
      }),

    setStep: (step: number) =>
      set((state) => {
        state.step = step; // 😎 直接修改！
      }),

    clearHistory: () =>
      set((state) => {
        state.history = []; // 😎 直接修改！
      }),

    // 😎 更新嵌套对象也很简单！
    updateMaxHistory: (max: number) =>
      set((state) => {
        state.settings.maxHistory = max; // 😎 直接修改嵌套对象！

        // 如果新的最大值更小，截断历史
        if (state.history.length > max) {
          state.history = state.history.slice(0, max);
        }
      })
  }))
);
