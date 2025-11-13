// ==================== 文件系统 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import type {
  FileNode,
  ScanOptions,
  FileStats,
  SearchOptions,
  WorkspaceValidationResult,
  IpcMethods
} from "@shared/types";

/**
 * 文件系统 API
 */
export const fileSystemApi = {
  /**
   * 扫描目录，构建文件树
   */
  async scanDirectory(dirPath: string, options?: ScanOptions): Promise<FileNode[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.SCAN_DIRECTORY, dirPath, options);
    return handleResponse(response);
  },

  /**
   * 读取文件内容
   */
  async readFile(filePath: string): Promise<string> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.READ_FILE, filePath);
    return handleResponse(response);
  },

  /**
   * 读取二进制文件内容
   */
  async readBinaryFile(filePath: string): Promise<ArrayBuffer> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.READ_BINARY_FILE as keyof IpcMethods, filePath);
    return handleResponse(response) as ArrayBuffer;
  },

  /**
   * 写入文件内容
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.WRITE_FILE, filePath, content);
    return handleResponse(response);
  },

  /**
   * 创建目录
   */
  async createDirectory(dirPath: string): Promise<void> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.CREATE_DIRECTORY, dirPath);
    return handleResponse(response);
  },

  /**
   * 删除文件或目录
   */
  async deleteFile(filePath: string): Promise<void> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.DELETE_FILE, filePath);
    return handleResponse(response);
  },

  /**
   * 重命名/移动文件或目录
   */
  async renameFile(oldPath: string, newPath: string): Promise<void> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.RENAME_FILE, oldPath, newPath);
    return handleResponse(response);
  },

  /**
   * 移动文件到指定目录
   */
  async moveFile(sourcePath: string, targetDir: string): Promise<string> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.MOVE_FILE, sourcePath, targetDir);
    return handleResponse(response);
  },

  /**
   * 复制文件
   */
  async copyFile(sourcePath: string, targetPath: string): Promise<void> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.COPY_FILE, sourcePath, targetPath);
    return handleResponse(response);
  },

  /**
   * 检查文件或目录是否存在
   */
  async exists(filePath: string): Promise<boolean> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.EXISTS, filePath);
    return handleResponse(response);
  },

  /**
   * 获取文件或目录的统计信息
   */
  async getStats(filePath: string): Promise<FileStats> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.GET_STATS, filePath);
    return handleResponse(response);
  },

  /**
   * 创建唯一文件名（避免重名）
   */
  async createUniqueFileName(dirPath: string, baseName: string, extension?: string): Promise<string> {
    const response = await ipcClient.invoke(
      IPC_CHANNELS.FILE_SYSTEM.CREATE_UNIQUE_FILENAME,
      dirPath,
      baseName,
      extension
    );
    return handleResponse(response);
  },

  /**
   * 获取目录大小（递归计算）
   */
  async getDirectorySize(dirPath: string): Promise<number> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.GET_DIRECTORY_SIZE, dirPath);
    return handleResponse(response);
  },

  /**
   * 搜索文件
   */
  async searchFiles(dirPath: string, searchTerm: string, options?: SearchOptions): Promise<FileNode[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.SEARCH_FILES, dirPath, searchTerm, options);
    return handleResponse(response);
  },

  /**
   * 保存图片文件
   */
  async saveImage(buffer: ArrayBuffer, originalName: string): Promise<string> {
    const response = await ipcClient.invoke(IPC_CHANNELS.FILE_SYSTEM.SAVE_IMAGE, buffer, originalName);
    return handleResponse(response) as string;
  }
};

/**
 * 工作区 API
 * 注意：工作区配置现在统一使用 configApi 管理，存储在 app-config.json 中
 */
export const workspaceApi = {
  /**
   * 获取默认工作区路径
   */
  async getDefaultPath(): Promise<string> {
    const response = await ipcClient.invoke(IPC_CHANNELS.WORKSPACE.GET_DEFAULT_PATH);
    return handleResponse(response);
  },

  /**
   * 选择目录对话框
   */
  async selectDirectory(): Promise<string | null> {
    const response = await ipcClient.invoke(IPC_CHANNELS.WORKSPACE.SELECT_DIRECTORY);
    return handleResponse(response);
  },

  /**
   * 验证工作区
   */
  async validateWorkspace(workspacePath: string): Promise<WorkspaceValidationResult> {
    const response = await ipcClient.invoke(IPC_CHANNELS.WORKSPACE.VALIDATE_WORKSPACE, workspacePath);
    return handleResponse(response);
  }
};

/**
 * 应用配置 API
 */
export const configApi = {
  /**
   * 获取配置值
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CONFIG.GET, key);
    const result = handleResponse(response);
    return result as T | null;
  },

  /**
   * 设置配置值
   */
  async set<T = unknown>(key: string, value: T): Promise<{ success: boolean }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CONFIG.SET, key, value);
    return handleResponse(response);
  },

  /**
   * 删除配置项
   */
  async remove(key: string): Promise<{ success: boolean }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CONFIG.REMOVE, key);
    return handleResponse(response);
  },

  /**
   * 获取所有配置
   */
  async getAll(): Promise<Record<string, unknown>> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CONFIG.GET_ALL);
    return handleResponse(response);
  }
};

/**
 * 配置键常量
 */
export const CONFIG_KEYS = {
  WORKSPACE_PATH: "workspacePath",
  COLLAPSED_FOLDERS: "collapsedFolders",
  LAST_OPENED_FILE: "lastOpenedFile",
  SORT_TYPE: "filesSortType",
  SORT_DIRECTION: "filesSortDirection",
  SHOW_HIDDEN_FILES: "showHiddenFiles",
  FILE_TREE_WIDTH: "fileTreeWidth"
} as const;

/**
 * 文件扩展名常量
 */
export const FILE_EXTENSIONS = {
  MARKDOWN: [".md", ".markdown"],
  TEXT: [".txt"],
  ALL_SUPPORTED: [".md", ".markdown", ".txt"]
} as const;
