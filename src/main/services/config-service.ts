import { FileSystemService } from "./file-system-service";
import { app } from "electron";
import * as path from "path";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 配置服务 (工具型服务)
 * 负责管理应用配置的存储和读取
 */
export class ConfigService {
  private fileSystemService: FileSystemService;
  private configPath: string;

  constructor() {
    this.fileSystemService = new FileSystemService();
    this.configPath = path.join(app.getPath("userData"), "app-config.json");
  }

  /**
   * 获取配置项
   */
  async getConfig(key: string): Promise<unknown | null> {
    try {
      const exists = await this.fileSystemService.exists(this.configPath);

      if (!exists) {
        return null;
      }

      const configContent = await this.fileSystemService.readFile(this.configPath);
      const config = JSON.parse(configContent);
      return config[key] || null;
    } catch (error) {
      console.error("读取配置失败:", error);
      return null;
    }
  }

  /**
   * 设置配置项
   */
  async setConfig(key: string, value: unknown): Promise<{ success: boolean }> {
    try {
      let config = {};

      // 读取现有配置
      const exists = await this.fileSystemService.exists(this.configPath);
      if (exists) {
        const configContent = await this.fileSystemService.readFile(this.configPath);
        config = JSON.parse(configContent);
      }

      // 更新配置
      (config as Record<string, unknown>)[key] = value;

      // 保存配置
      await this.fileSystemService.writeFile(this.configPath, JSON.stringify(config, null, 2));
      return { success: true };
    } catch (error) {
      console.error("保存配置失败:", error);
      throw error;
    }
  }

  /**
   * 删除配置项
   */
  async removeConfig(key: string): Promise<{ success: boolean }> {
    try {
      const exists = await this.fileSystemService.exists(this.configPath);

      if (!exists) {
        return { success: true }; // 文件不存在，认为删除成功
      }

      const configContent = await this.fileSystemService.readFile(this.configPath);
      const config = JSON.parse(configContent);

      delete (config as Record<string, unknown>)[key];

      await this.fileSystemService.writeFile(this.configPath, JSON.stringify(config, null, 2));
      return { success: true };
    } catch (error) {
      console.error("删除配置失败:", error);
      throw error;
    }
  }

  /**
   * 获取所有配置
   */
  async getAllConfig(): Promise<Record<string, unknown>> {
    try {
      const exists = await this.fileSystemService.exists(this.configPath);

      if (!exists) {
        return {};
      }

      const configContent = await this.fileSystemService.readFile(this.configPath);
      return JSON.parse(configContent);
    } catch (error) {
      console.error("读取所有配置失败:", error);
      return {};
    }
  }

  /**
   * 注册配置相关的 IPC 处理器
   */
  registerConfigHandlers(): void {
    // 获取配置
    registerHandler(IPC_CHANNELS.CONFIG.GET, async (key: string) => {
      return await this.getConfig(key);
    });

    // 设置配置
    registerHandler(IPC_CHANNELS.CONFIG.SET, async (key: string, value: unknown) => {
      return await this.setConfig(key, value);
    });

    // 删除配置
    registerHandler(IPC_CHANNELS.CONFIG.REMOVE, async (key: string) => {
      return await this.removeConfig(key);
    });

    // 获取所有配置
    registerHandler(IPC_CHANNELS.CONFIG.GET_ALL, async () => {
      return await this.getAllConfig();
    });
  }
}
