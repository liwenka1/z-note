import * as fs from "fs/promises";
import { watch } from "fs";
import * as path from "path";
import { app } from "electron";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 文件节点接口
 */
export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modifiedTime?: Date;
  children?: FileNode[];
  isEditing?: boolean;
}

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
 * 扫描选项
 */
export interface ScanOptions {
  recursive?: boolean;
  includeHidden?: boolean;
  fileFilter?: (filename: string) => boolean;
  maxDepth?: number;
}

/**
 * 文件系统服务
 * 提供完整的文件系统操作功能，替代 Tauri 的文件系统 API
 */
export class FileSystemService {
  private defaultWorkspacePath: string;

  constructor() {
    // 默认工作区路径：用户文档/z-note
    this.defaultWorkspacePath = path.join(app.getPath("documents"), "z-note");
  }

  /**
   * 获取默认工作区路径
   */
  getDefaultWorkspacePath(): string {
    return this.defaultWorkspacePath;
  }

  /**
   * 扫描目录，构建文件树
   */
  async scanDirectory(dirPath: string, options: ScanOptions = {}): Promise<FileNode[]> {
    try {
      const { recursive = true, includeHidden = false, fileFilter = () => true, maxDepth = 10 } = options;

      // 确保目录存在
      await this.ensureDirectoryExists(dirPath);

      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const nodes: FileNode[] = [];

      for (const entry of entries) {
        // 跳过隐藏文件（除非明确包含）
        if (!includeHidden && entry.name.startsWith(".")) {
          continue;
        }

        const fullPath = path.join(dirPath, entry.name);
        const stat = await fs.stat(fullPath);

        if (entry.isDirectory()) {
          const folderNode: FileNode = {
            name: entry.name,
            path: fullPath,
            isDirectory: true,
            modifiedTime: stat.mtime,
            children: []
          };

          // 递归扫描子目录
          if (recursive && maxDepth > 0) {
            folderNode.children = await this.scanDirectory(fullPath, {
              ...options,
              maxDepth: maxDepth - 1
            });
          }

          nodes.push(folderNode);
        } else if (entry.isFile() && fileFilter(entry.name)) {
          const fileNode: FileNode = {
            name: entry.name,
            path: fullPath,
            isDirectory: false,
            size: stat.size,
            modifiedTime: stat.mtime
          };

          nodes.push(fileNode);
        }
      }

      // 排序：文件夹在前，然后按名称排序
      return nodes.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error("扫描目录失败:", dirPath, error);
      throw new Error(`扫描目录失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 读取文件内容
   */
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      console.error("读取文件失败:", filePath, error);
      throw new Error(`读取文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 读取二进制文件内容
   */
  async readBinaryFile(filePath: string): Promise<ArrayBuffer> {
    try {
      const buffer = await fs.readFile(filePath);
      // 确保返回的是 ArrayBuffer 类型
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
    } catch (error) {
      console.error("读取二进制文件失败:", filePath, error);
      throw new Error(`读取二进制文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 写入文件内容
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // 确保父目录存在
      const dirname = path.dirname(filePath);
      await this.ensureDirectoryExists(dirname);

      await fs.writeFile(filePath, content, "utf-8");
    } catch (error) {
      console.error("写入文件失败:", filePath, error);
      throw new Error(`写入文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 创建目录
   */
  async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error("创建目录失败:", dirPath, error);
      throw new Error(`创建目录失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 删除文件或目录
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await fs.rmdir(filePath, { recursive: true });
      } else {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error("删除文件失败:", filePath, error);
      throw new Error(`删除文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 重命名/移动文件或目录
   */
  async renameFile(oldPath: string, newPath: string): Promise<void> {
    try {
      // 确保目标目录存在
      const targetDir = path.dirname(newPath);
      await this.ensureDirectoryExists(targetDir);

      await fs.rename(oldPath, newPath);
    } catch (error) {
      console.error("重命名文件失败:", oldPath, "->", newPath, error);
      throw new Error(`重命名文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 移动文件到指定目录
   */
  async moveFile(sourcePath: string, targetDir: string): Promise<string> {
    try {
      const fileName = path.basename(sourcePath);
      const targetPath = path.join(targetDir, fileName);

      await this.renameFile(sourcePath, targetPath);
      return targetPath;
    } catch (error) {
      console.error("移动文件失败:", sourcePath, "->", targetDir, error);
      throw new Error(`移动文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 复制文件
   */
  async copyFile(sourcePath: string, targetPath: string): Promise<void> {
    try {
      // 确保目标目录存在
      const targetDir = path.dirname(targetPath);
      await this.ensureDirectoryExists(targetDir);

      await fs.copyFile(sourcePath, targetPath);
    } catch (error) {
      console.error("复制文件失败:", sourcePath, "->", targetPath, error);
      throw new Error(`复制文件失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 检查文件或目录是否存在
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取文件或目录的统计信息
   */
  async getStats(filePath: string): Promise<{
    isDirectory: boolean;
    isFile: boolean;
    size: number;
    modifiedTime: Date;
    createdTime: Date;
  }> {
    try {
      const stats = await fs.stat(filePath);
      return {
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        size: stats.size,
        modifiedTime: stats.mtime,
        createdTime: stats.birthtime
      };
    } catch (error) {
      console.error("获取文件统计信息失败:", filePath, error);
      throw new Error(`获取文件统计信息失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 创建唯一文件名（避免重名）
   */
  async createUniqueFileName(dirPath: string, baseName: string, extension: string = ""): Promise<string> {
    let counter = 0;
    let fileName = baseName + extension;
    let fullPath = path.join(dirPath, fileName);

    while (await this.exists(fullPath)) {
      counter++;
      fileName = `${baseName} (${counter})${extension}`;
      fullPath = path.join(dirPath, fileName);
    }

    return fileName;
  }

  /**
   * 确保目录存在，不存在则创建
   */
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * 获取目录大小（递归计算）
   */
  async getDirectorySize(dirPath: string): Promise<number> {
    try {
      let totalSize = 0;
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          totalSize += await this.getDirectorySize(fullPath);
        } else if (entry.isFile()) {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error("计算目录大小失败:", dirPath, error);
      return 0;
    }
  }

  /**
   * 监听文件系统变化（返回清理函数）
   */
  watchDirectory(dirPath: string, callback: (eventType: string, filename: string | null) => void): () => void {
    try {
      // 使用导入的 watch 函数
      const watcher = watch(dirPath, { recursive: true }, callback);
      return () => {
        if (watcher && typeof watcher.close === "function") {
          watcher.close();
        }
      };
    } catch (error) {
      console.error("监听目录失败:", dirPath, error);
      return () => {};
    }
  }

  /**
   * 搜索文件
   */
  async searchFiles(
    dirPath: string,
    searchTerm: string,
    options: {
      searchInContent?: boolean;
      fileExtensions?: string[];
      caseSensitive?: boolean;
      maxResults?: number;
    } = {}
  ): Promise<FileNode[]> {
    const {
      searchInContent = false,
      fileExtensions = [".md", ".txt"],
      caseSensitive = false,
      maxResults = 100
    } = options;

    const results: FileNode[] = [];
    const searchPattern = caseSensitive ? searchTerm : searchTerm.toLowerCase();

    const searchRecursive = async (currentDir: string, depth = 0): Promise<void> => {
      if (results.length >= maxResults || depth > 10) return;

      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          if (results.length >= maxResults) break;

          const fullPath = path.join(currentDir, entry.name);
          const entryName = caseSensitive ? entry.name : entry.name.toLowerCase();

          if (entry.isDirectory()) {
            // 目录名匹配
            if (entryName.includes(searchPattern)) {
              const stats = await fs.stat(fullPath);
              results.push({
                name: entry.name,
                path: fullPath,
                isDirectory: true,
                modifiedTime: stats.mtime
              });
            }
            // 递归搜索子目录
            await searchRecursive(fullPath, depth + 1);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();

            // 检查文件扩展名
            if (fileExtensions.length > 0 && !fileExtensions.includes(ext)) {
              continue;
            }

            let isMatch = false;

            // 文件名匹配
            if (entryName.includes(searchPattern)) {
              isMatch = true;
            }

            // 文件内容匹配
            if (!isMatch && searchInContent) {
              try {
                const content = await fs.readFile(fullPath, "utf-8");
                const contentToSearch = caseSensitive ? content : content.toLowerCase();
                if (contentToSearch.includes(searchPattern)) {
                  isMatch = true;
                }
              } catch {
                // 忽略无法读取的文件
              }
            }

            if (isMatch) {
              const stats = await fs.stat(fullPath);
              results.push({
                name: entry.name,
                path: fullPath,
                isDirectory: false,
                size: stats.size,
                modifiedTime: stats.mtime
              });
            }
          }
        }
      } catch (error) {
        console.error("搜索目录失败:", currentDir, error);
      }
    };

    await searchRecursive(dirPath);
    return results;
  }

  /**
   * 注册文件系统相关的 IPC 处理器
   */
  registerFileSystemHandlers(): void {
    // 扫描目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.SCAN_DIRECTORY, async (dirPath: string, options?: ScanOptions) => {
      return await this.scanDirectory(dirPath, options);
    });

    // 读取文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.READ_FILE, async (filePath: string) => {
      return await this.readFile(filePath);
    });

    // 读取二进制文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.READ_BINARY_FILE, async (filePath: string) => {
      return await this.readBinaryFile(filePath);
    });

    // 写入文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.WRITE_FILE, async (filePath: string, content: string) => {
      return await this.writeFile(filePath, content);
    });

    // 创建目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.CREATE_DIRECTORY, async (dirPath: string) => {
      return await this.createDirectory(dirPath);
    });

    // 删除文件或目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.DELETE_FILE, async (filePath: string) => {
      return await this.deleteFile(filePath);
    });

    // 重命名/移动文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.RENAME_FILE, async (oldPath: string, newPath: string) => {
      return await this.renameFile(oldPath, newPath);
    });

    // 移动文件到指定目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.MOVE_FILE, async (sourcePath: string, targetDir: string) => {
      return await this.moveFile(sourcePath, targetDir);
    });

    // 复制文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.COPY_FILE, async (sourcePath: string, targetPath: string) => {
      return await this.copyFile(sourcePath, targetPath);
    });

    // 检查文件是否存在
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.EXISTS, async (filePath: string) => {
      return await this.exists(filePath);
    });

    // 获取文件统计信息
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.GET_STATS, async (filePath: string) => {
      return await this.getStats(filePath);
    });

    // 创建唯一文件名
    registerHandler(
      IPC_CHANNELS.FILE_SYSTEM.CREATE_UNIQUE_FILENAME,
      async (dirPath: string, baseName: string, extension?: string) => {
        return await this.createUniqueFileName(dirPath, baseName, extension);
      }
    );

    // 获取目录大小
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.GET_DIRECTORY_SIZE, async (dirPath: string) => {
      return await this.getDirectorySize(dirPath);
    });

    // 搜索文件
    registerHandler(
      IPC_CHANNELS.FILE_SYSTEM.SEARCH_FILES,
      async (
        dirPath: string,
        searchTerm: string,
        options?: {
          searchInContent?: boolean;
          fileExtensions?: string[];
          caseSensitive?: boolean;
          maxResults?: number;
        }
      ) => {
        return await this.searchFiles(dirPath, searchTerm, options);
      }
    );
  }
}
