import { BaseService } from "./base-service";
import { FileSystemService } from "./file-system-service";
import { dialog, app } from "electron";
import * as path from "path";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 工作区配置接口
 */
export interface WorkspaceConfig {
  path: string;
  isDefault: boolean;
  lastOpenedFile?: string;
  collapsedFolders: string[];
}

/**
 * 工作区服务
 * 负责管理工作区配置和相关操作
 */
export class WorkspaceService extends BaseService {
  private fileSystemService: FileSystemService;

  constructor() {
    super();
    this.fileSystemService = new FileSystemService();
  }

  /**
   * 获取默认工作区路径
   */
  getDefaultWorkspacePath(): string {
    return this.fileSystemService.getDefaultWorkspacePath();
  }

  /**
   * 获取工作区配置
   */
  async getWorkspaceConfig(): Promise<WorkspaceConfig> {
    try {
      const configPath = path.join(app.getPath("userData"), "workspace-config.json");
      const exists = await this.fileSystemService.exists(configPath);

      if (!exists) {
        // 返回默认配置
        const defaultConfig: WorkspaceConfig = {
          path: this.fileSystemService.getDefaultWorkspacePath(),
          isDefault: true,
          collapsedFolders: []
        };
        return defaultConfig;
      }

      const configContent = await this.fileSystemService.readFile(configPath);
      return JSON.parse(configContent) as WorkspaceConfig;
    } catch (error) {
      console.error("读取工作区配置失败:", error);
      // 返回默认配置
      return {
        path: this.fileSystemService.getDefaultWorkspacePath(),
        isDefault: true,
        collapsedFolders: []
      } as WorkspaceConfig;
    }
  }

  /**
   * 设置工作区配置
   */
  async setWorkspaceConfig(config: WorkspaceConfig): Promise<{ success: boolean }> {
    try {
      const configPath = path.join(app.getPath("userData"), "workspace-config.json");
      await this.fileSystemService.writeFile(configPath, JSON.stringify(config, null, 2));
      return { success: true };
    } catch (error) {
      console.error("保存工作区配置失败:", error);
      throw error;
    }
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

    // 获取工作区配置
    registerHandler(IPC_CHANNELS.WORKSPACE.GET_CONFIG, async () => {
      return await this.getWorkspaceConfig();
    });

    // 设置工作区配置
    registerHandler(IPC_CHANNELS.WORKSPACE.SET_CONFIG, async (config: WorkspaceConfig) => {
      return await this.setWorkspaceConfig(config);
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
