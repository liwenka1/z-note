// ==================== 主题 API ====================

import { ipcClient, handleResponse } from "./ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 主题相关 API
 */
export const themeApi = {
  /**
   * 设置原生主题
   */
  async setNativeTheme(theme: "light" | "dark" | "system"): Promise<boolean> {
    const response = await ipcClient.invoke(IPC_CHANNELS.THEME.SET_NATIVE_THEME, theme);
    const result = handleResponse(response);
    return result.success;
  }
};
