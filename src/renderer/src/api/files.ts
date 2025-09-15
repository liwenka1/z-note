// ==================== 文件系统 API 封装 ====================

import { fileSystemApi } from "./file-system";
import type { NoteFileContent, NoteFileMetadata } from "@renderer/types/file-content";
import {
  createEmptyNoteFile,
  updateNoteFileContent,
  validateNoteFile,
  getTitleFromFileName
} from "@renderer/types/file-content";

/**
 * 文件系统相关的错误类型
 */
export class FileSystemError extends Error {
  constructor(
    message: string,
    public code: string,
    public filePath?: string
  ) {
    super(message);
    this.name = "FileSystemError";
  }
}

export const filesApi = {
  /**
   * 读取笔记文件
   */
  async readNoteFile(filePath: string): Promise<NoteFileContent> {
    try {
      const content = await fileSystemApi.readFile(filePath);
      const parsed = JSON.parse(content);

      if (!validateNoteFile(parsed)) {
        throw new FileSystemError("文件格式不正确", "INVALID_FORMAT", filePath);
      }

      return parsed;
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }

      if (error instanceof SyntaxError) {
        throw new FileSystemError("JSON 格式错误", "JSON_PARSE_ERROR", filePath);
      }

      // 处理文件不存在等其他错误
      throw new FileSystemError(
        `读取文件失败: ${error instanceof Error ? error.message : "未知错误"}`,
        "READ_ERROR",
        filePath
      );
    }
  },

  /**
   * 写入笔记文件
   */
  async writeNoteFile(filePath: string, content: NoteFileContent): Promise<void> {
    try {
      const jsonString = JSON.stringify(content, null, 2);
      await fileSystemApi.writeFile(filePath, jsonString);
    } catch (error) {
      throw new FileSystemError(
        `写入文件失败: ${error instanceof Error ? error.message : "未知错误"}`,
        "WRITE_ERROR",
        filePath
      );
    }
  },

  /**
   * 创建新笔记文件
   */
  async createNoteFile(filePath: string, title?: string): Promise<NoteFileContent> {
    try {
      // 如果没有提供标题，从文件名提取
      const fileName = filePath.split(/[/\\]/).pop() || "新建笔记.json";
      const noteTitle = title || getTitleFromFileName(fileName);

      const content = createEmptyNoteFile(noteTitle);
      await this.writeNoteFile(filePath, content);
      return content;
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }

      throw new FileSystemError(
        `创建文件失败: ${error instanceof Error ? error.message : "未知错误"}`,
        "CREATE_ERROR",
        filePath
      );
    }
  },

  /**
   * 更新笔记文件内容
   */
  async updateNoteFile(
    filePath: string,
    newContent: import("@tiptap/react").JSONContent,
    newTitle?: string
  ): Promise<NoteFileContent> {
    try {
      const existingFile = await this.readNoteFile(filePath);
      const updatedFile = updateNoteFileContent(existingFile, newContent, newTitle);
      await this.writeNoteFile(filePath, updatedFile);
      return updatedFile;
    } catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }

      throw new FileSystemError(
        `更新文件失败: ${error instanceof Error ? error.message : "未知错误"}`,
        "UPDATE_ERROR",
        filePath
      );
    }
  },

  /**
   * 删除笔记文件
   */
  async deleteNoteFile(filePath: string): Promise<void> {
    try {
      await fileSystemApi.deleteFile(filePath);
    } catch (error) {
      throw new FileSystemError(
        `删除文件失败: ${error instanceof Error ? error.message : "未知错误"}`,
        "DELETE_ERROR",
        filePath
      );
    }
  },

  /**
   * 检查文件是否存在
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fileSystemApi.readFile(filePath);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 获取文件元数据（不读取内容）
   */
  async getFileMetadata(filePath: string): Promise<NoteFileMetadata | null> {
    try {
      const content = await this.readNoteFile(filePath);
      return content.metadata;
    } catch {
      return null;
    }
  }
};
