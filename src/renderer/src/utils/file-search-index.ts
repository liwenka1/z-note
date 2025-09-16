// ==================== 文件搜索索引系统 ====================

import { fileSystemApi, workspaceApi } from "@renderer/api/file-system";
import { filesApi } from "@renderer/api/files";
import type { NoteFileContent } from "@renderer/types/file-content";
import { extractSearchableContent, extractDocumentStructure } from "./tiptap-content-extractor";
import { DEFAULT_WORKSPACE_PATH } from "@renderer/config/workspace";

/**
 * 搜索索引项 - 完全效仿 z-note Tauri 项目的数据结构
 */
export interface SearchIndexItem {
  id: string;
  title: string;
  content: string; // 完整的文本内容（效仿 'article' 字段）
  fullText: string; // 标题 + 内容的完整文本
  path: string;
  type: "note" | "file";
  metadata: NoteFileContent["metadata"];
  // 扩展字段
  headings?: Array<{ level: number; text: string }>;
  links?: Array<{ href: string; text: string }>;
  codeBlocks?: Array<{ language?: string; code: string }>;
}

/**
 * 文件搜索索引管理器
 * 完全效仿 Tauri 项目的内存索引策略
 */
class FileSearchIndexManager {
  private searchIndex: SearchIndexItem[] = [];
  private isIndexing = false;
  private lastIndexTime: number = 0;

  /**
   * 构建完整的文件索引 - 效仿 readDirRecursively + setSearchData
   */
  async buildIndex(workspacePath?: string): Promise<void> {
    if (this.isIndexing) {
      return;
    }

    this.isIndexing = true;

    try {
      this.searchIndex = [];

      const currentWorkspace = workspacePath || (await this.getCurrentWorkspace());
      if (!currentWorkspace) {
        return;
      }

      // 递归扫描所有 JSON 文件 - 效仿 readDirRecursively
      await this.scanDirectoryRecursively(currentWorkspace);

      this.lastIndexTime = Date.now();
    } catch (error) {
      console.error("构建文件索引失败:", error);
    } finally {
      this.isIndexing = false;
    }
  }

  /**
   * 递归扫描目录中的所有 JSON 文件
   */
  private async scanDirectoryRecursively(dirPath: string): Promise<void> {
    try {
      const entries = await fileSystemApi.scanDirectory(dirPath);

      for (const entry of entries) {
        const fullPath = `${dirPath}/${entry.name}`;

        if (entry.isDirectory) {
          // 递归扫描子目录
          await this.scanDirectoryRecursively(fullPath);
        } else if (!entry.isDirectory && entry.name.endsWith(".json")) {
          // 处理 JSON 笔记文件 - 效仿读取 .md 文件的逻辑
          await this.indexNoteFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`扫描目录失败: ${dirPath}`, error);
    }
  }

  /**
   * 索引单个笔记文件 - 效仿 Tauri 项目的文件内容读取
   */
  private async indexNoteFile(filePath: string): Promise<void> {
    try {
      // 读取并解析 JSON 文件内容
      const noteFile = await filesApi.readNoteFile(filePath);

      // 提取可搜索的内容 - 完全效仿 article 字段
      const searchableContent = extractSearchableContent(noteFile);
      const documentStructure = extractDocumentStructure(noteFile.content);

      // 创建搜索索引项
      const indexItem: SearchIndexItem = {
        id: `file:${filePath}`,
        title: searchableContent.title,
        content: searchableContent.content, // 完整文本内容，效仿 'article'
        fullText: searchableContent.fullText,
        path: filePath,
        type: "file",
        metadata: searchableContent.metadata,
        headings: documentStructure.headings,
        links: documentStructure.links,
        codeBlocks: documentStructure.codeBlocks
      };

      this.searchIndex.push(indexItem);
    } catch (error) {
      console.error(`索引文件失败: ${filePath}`, error);
    }
  }

  /**
   * 获取当前工作区路径
   */
  private async getCurrentWorkspace(): Promise<string | null> {
    try {
      // 首先尝试使用工作区 API 获取路径
      try {
        const config = await workspaceApi.getConfig();
        if (config.workspacePath) {
          return config.workspacePath;
        }
      } catch (apiError) {
        // 静默失败，使用默认路径
      }

      // 如果 API 失败或没有配置，使用默认工作区路径
      return DEFAULT_WORKSPACE_PATH;
    } catch (error) {
      console.error("获取工作区路径失败:", error);
      // 最后的兜底方案，返回默认路径
      return DEFAULT_WORKSPACE_PATH;
    }
  }

  /**
   * 获取搜索索引 - 供搜索功能使用
   */
  getSearchIndex(): SearchIndexItem[] {
    return this.searchIndex;
  }

  /**
   * 添加或更新单个文件的索引
   */
  async updateFileIndex(filePath: string): Promise<void> {
    try {
      // 移除旧的索引项
      this.searchIndex = this.searchIndex.filter((item) => item.path !== filePath);

      // 添加新的索引项
      if (filePath.endsWith(".json")) {
        await this.indexNoteFile(filePath);
      }
    } catch (error) {
      console.error(`更新文件索引失败: ${filePath}`, error);
    }
  }

  /**
   * 移除文件索引
   */
  removeFileIndex(filePath: string): void {
    this.searchIndex = this.searchIndex.filter((item) => item.path !== filePath);
  }

  /**
   * 检查是否需要重建索引
   */
  shouldRebuildIndex(): boolean {
    // 在调试阶段，如果索引为空总是重建
    if (this.searchIndex.length === 0) {
      console.log("🔄 索引为空，需要重建");
      return true;
    }

    const REBUILD_INTERVAL = 5 * 60 * 1000; // 5分钟
    const needsRebuild = Date.now() - this.lastIndexTime > REBUILD_INTERVAL;

    if (needsRebuild) {
      console.log("⏰ 索引过期，需要重建");
    }

    return needsRebuild;
  }

  /**
   * 强制清空并重建索引（调试用）
   */
  forceRebuild(): void {
    console.log("🧹 强制清空索引");
    this.searchIndex = [];
    this.lastIndexTime = 0;
    this.isIndexing = false;
  }

  /**
   * 获取索引统计信息
   */
  getIndexStats(): {
    totalFiles: number;
    lastIndexTime: number;
    isIndexing: boolean;
  } {
    return {
      totalFiles: this.searchIndex.length,
      lastIndexTime: this.lastIndexTime,
      isIndexing: this.isIndexing
    };
  }
}

// 导出单例实例
export const fileSearchIndex = new FileSearchIndexManager();
