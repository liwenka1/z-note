import { FileSystemService } from "./file-system-service";
import { dialog } from "electron";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 工作区服务 (工具型服务)
 * 负责工作区相关的工具方法：
 * - 获取默认工作区路径
 * - 选择目录对话框
 * - 验证工作区路径
 *
 * 注意：工作区配置现在统一存储在 app-config.json 中，通过 configApi 访问
 */
export class WorkspaceService {
  private fileSystemService: FileSystemService;

  constructor() {
    this.fileSystemService = new FileSystemService();
  }

  /**
   * 获取默认工作区路径
   */
  getDefaultWorkspacePath(): string {
    return this.fileSystemService.getDefaultWorkspacePath();
  }

  /**
   * 选择目录对话框
   */
  async selectDirectory(): Promise<string | null> {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "选择工作区目录"
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  }

  /**
   * 验证工作区
   */
  async validateWorkspace(workspacePath: string): Promise<{ isValid: boolean; error?: string }> {
    try {
      const exists = await this.fileSystemService.exists(workspacePath);
      if (!exists) {
        return { isValid: false, error: "目录不存在" };
      }

      const stats = await this.fileSystemService.getStats(workspacePath);
      if (!stats.isDirectory) {
        return { isValid: false, error: "路径不是目录" };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "验证失败"
      };
    }
  }

  /**
   * 注册工作区相关的 IPC 处理器
   */
  registerWorkspaceHandlers(): void {
    // 获取默认工作区路径
    registerHandler(IPC_CHANNELS.WORKSPACE.GET_DEFAULT_PATH, async () => {
      return this.getDefaultWorkspacePath();
    });

    // 选择目录对话框
    registerHandler(IPC_CHANNELS.WORKSPACE.SELECT_DIRECTORY, async () => {
      return await this.selectDirectory();
    });

    // 验证工作区
    registerHandler(IPC_CHANNELS.WORKSPACE.VALIDATE_WORKSPACE, async (workspacePath: string) => {
      return await this.validateWorkspace(workspacePath);
    });
  }
}
