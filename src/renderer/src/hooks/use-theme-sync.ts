import { useEffect } from "react";
import { useTheme } from "next-themes";
import { themeApi } from "@renderer/api";

/**
 * 主题同步 Hook
 * 负责在主题变化时同步到主进程的原生主题
 */
export function useThemeSync() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // 确保主题已经解析完成
    if (!resolvedTheme) return;

    // 同步主题到主进程
    const syncTheme = async () => {
      try {
        // 使用 resolvedTheme 而不是 theme，因为 resolvedTheme 会处理 "system" 主题
        const themeToSync = resolvedTheme as "light" | "dark";
        await themeApi.setNativeTheme(themeToSync);
        console.log(`[ThemeSync] 同步主题到主进程: ${themeToSync}`);
      } catch (error) {
        console.error("[ThemeSync] 同步主题失败:", error);
      }
    };

    syncTheme();
  }, [resolvedTheme]);

  // 返回当前主题信息，供其他组件使用
  return {
    theme,
    resolvedTheme
  };
}
