import { nativeTheme } from "electron";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 主题服务 (工具型服务)
 * 负责管理应用的原生主题
 */
export class ThemeService {
  /**
   * 设置原生主题
   */
  async setNativeTheme(theme: "light" | "dark" | "system"): Promise<{ success: boolean }> {
    try {
      nativeTheme.themeSource = theme;
      return { success: true };
    } catch (error) {
      console.error("[ThemeService] 设置原生主题失败:", error);
      return { success: false };
    }
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): { theme: string; shouldUseDarkColors: boolean } {
    return {
      theme: nativeTheme.themeSource,
      shouldUseDarkColors: nativeTheme.shouldUseDarkColors
    };
  }

  /**
   * 注册主题相关的 IPC 处理器
   */
  registerThemeHandlers(): void {
    // 设置原生主题
    registerHandler(
      IPC_CHANNELS.THEME.SET_NATIVE_THEME,
      async (theme: "light" | "dark" | "system") => {
        return await this.setNativeTheme(theme);
      },
      "ThemeService"
    );
  }
}
