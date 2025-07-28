import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark"; // 系统主题解析后的实际主题
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void; // 在 light 和 dark 之间切换
}

type ThemeStore = ThemeState & ThemeActions;

// 检测系统主题
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

// 从 localStorage 读取保存的主题
const getSavedTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("z-note-theme");
    if (saved && ["light", "dark", "system"].includes(saved)) {
      return saved as Theme;
    }
  }
  return "system";
};

// 解析主题（将 system 转换为实际的 light/dark）
const resolveTheme = (theme: Theme): "light" | "dark" => {
  return theme === "system" ? getSystemTheme() : theme;
};

// 应用主题到 DOM
const applyTheme = (resolvedTheme: "light" | "dark") => {
  if (typeof window !== "undefined") {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }
};

const initialTheme = getSavedTheme();
const initialResolvedTheme = resolveTheme(initialTheme);

// 初始化时应用主题
if (typeof window !== "undefined") {
  applyTheme(initialResolvedTheme);
}

export const useThemeStore = create<ThemeStore>()(
  immer((set, get) => ({
    theme: initialTheme,
    resolvedTheme: initialResolvedTheme,

    setTheme: (theme: Theme) =>
      set((state) => {
        state.theme = theme;
        state.resolvedTheme = resolveTheme(theme);

        // 保存到 localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("z-note-theme", theme);
          applyTheme(state.resolvedTheme);
        }
      }),

    toggleTheme: () => {
      const currentTheme = get().theme;
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      get().setTheme(newTheme);
    }
  }))
);

// 监听系统主题变化
if (typeof window !== "undefined" && window.matchMedia) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    const { theme, setTheme } = useThemeStore.getState();
    if (theme === "system") {
      // 如果当前是系统模式，重新解析并应用主题
      setTheme("system");
    }
  });
}
