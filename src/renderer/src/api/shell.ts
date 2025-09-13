// ==================== Shell 系统操作 API ====================

import { ipcClient } from "./ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * Shell 系统操作 API
 */
export const shellApi = {
  /**
   * 在文件管理器中显示文件/文件夹
   * @param itemPath 文件或文件夹的完整路径
   */
  async showItemInFolder(itemPath: string): Promise<void> {
    await ipcClient.invoke(IPC_CHANNELS.SHELL.SHOW_ITEM_IN_FOLDER, itemPath);
  },

  /**
   * 打开文件夹
   * @param folderPath 文件夹路径
   */
  async openPath(folderPath: string): Promise<void> {
    await ipcClient.invoke(IPC_CHANNELS.SHELL.OPEN_PATH, folderPath);
  },

  /**
   * 打开外部链接
   * @param url 要打开的URL
   */
  async openExternal(url: string): Promise<void> {
    await ipcClient.invoke(IPC_CHANNELS.SHELL.OPEN_EXTERNAL, url);
  }
};
