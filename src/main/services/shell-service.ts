import { shell } from "electron";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 系统Shell操作服务 (工具型服务)
 * 负责处理文件管理器、外部链接等系统操作
 */
export class ShellService {
  /**
   * 在文件管理器中显示文件/文件夹
   */
  async showItemInFolder(itemPath: string): Promise<{ success: boolean }> {
    try {
      shell.showItemInFolder(itemPath);
      return { success: true };
    } catch (error) {
      console.error("显示文件位置失败:", error);
      throw error;
    }
  }

  /**
   * 打开路径（文件夹）
   */
  async openPath(folderPath: string): Promise<{ success: boolean }> {
    try {
      await shell.openPath(folderPath);
      return { success: true };
    } catch (error) {
      console.error("打开文件夹失败:", error);
      throw error;
    }
  }

  /**
   * 打开外部链接
   */
  async openExternal(url: string): Promise<{ success: boolean }> {
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error) {
      console.error("打开外部链接失败:", error);
      throw error;
    }
  }

  /**
   * 注册Shell相关的 IPC 处理器
   */
  registerShellHandlers(): void {
    // 在文件管理器中显示文件/文件夹
    registerHandler(IPC_CHANNELS.SHELL.SHOW_ITEM_IN_FOLDER, async (itemPath: string) => {
      return await this.showItemInFolder(itemPath);
    });

    // 打开路径（文件夹）
    registerHandler(IPC_CHANNELS.SHELL.OPEN_PATH, async (folderPath: string) => {
      return await this.openPath(folderPath);
    });

    // 打开外部链接
    registerHandler(IPC_CHANNELS.SHELL.OPEN_EXTERNAL, async (url: string) => {
      return await this.openExternal(url);
    });
  }
}
