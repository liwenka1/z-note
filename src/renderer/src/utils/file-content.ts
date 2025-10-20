// ==================== 文件内容工具函数 ====================

import type { JSONContent } from "@tiptap/react";
import { NOTE_CONSTANTS } from "@renderer/constants/note-constants";
import type { NoteFileContent } from "@renderer/types/file-content";

/**
 * 创建一个空的笔记文件内容
 */
export function createEmptyNoteFile(title: string): NoteFileContent {
  const now = new Date().toISOString();

  return {
    version: NOTE_CONSTANTS.DEFAULT_VERSION,
    content: {
      type: "doc",
      content: []
    },
    metadata: {
      title,
      createdAt: now,
      updatedAt: now,
      characterCount: 0
    }
  };
}

/**
 * 更新笔记文件的内容和元数据
 */
export function updateNoteFileContent(
  existingFile: NoteFileContent,
  newContent: JSONContent,
  newTitle?: string
): NoteFileContent {
  return {
    ...existingFile,
    content: newContent,
    metadata: {
      ...existingFile.metadata,
      ...(newTitle && { title: newTitle }),
      updatedAt: new Date().toISOString()
      // 可以在这里计算字符数等统计信息
    }
  };
}

/**
 * 验证笔记文件格式是否正确
 */
export function validateNoteFile(data: unknown): data is NoteFileContent {
  if (!data || typeof data !== "object") {
    return false;
  }

  const file = data as Record<string, unknown>;

  // 检查必需字段
  return (
    typeof file.version === "string" &&
    typeof file.content === "object" &&
    file.content !== null &&
    typeof file.metadata === "object" &&
    file.metadata !== null &&
    typeof (file.metadata as Record<string, unknown>).title === "string" &&
    typeof (file.metadata as Record<string, unknown>).createdAt === "string" &&
    typeof (file.metadata as Record<string, unknown>).updatedAt === "string"
  );
}

/**
 * 文件路径工具函数
 */
export function isFileNoteId(noteId: string): boolean {
  return noteId.startsWith("file:");
}

export function getFilePathFromNoteId(noteId: string): string {
  return noteId.replace(/^file:/, "");
}

export function createFileNoteId(filePath: string): string {
  return `file:${filePath}`;
}

/**
 * 从文件名提取标题（去掉 .json 扩展名）
 */
export function getTitleFromFileName(fileName: string): string {
  return fileName.replace(new RegExp(`\\${NOTE_CONSTANTS.FILE_EXTENSION}$`), "");
}

/**
 * 生成唯一的笔记文件名
 */
export function generateUniqueFileName(prefix: string = NOTE_CONSTANTS.DEFAULT_NOTE_PREFIX): string {
  return `${prefix}_${Date.now()}${NOTE_CONSTANTS.FILE_EXTENSION}`;
}
