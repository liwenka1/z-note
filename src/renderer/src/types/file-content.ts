// ==================== 文件内容类型定义 ====================

import type { JSONContent } from "@tiptap/react";

/**
 * z-note 标准笔记文件格式
 * 用于存储 TipTap 编辑器的内容到文件系统
 */
export interface NoteFileContent {
  /** 文件格式版本 */
  version: string;
  /** TipTap JSON 格式的内容 */
  content: JSONContent;
  /** 文件元数据 */
  metadata: NoteFileMetadata;
}

/**
 * 笔记文件元数据
 */
export interface NoteFileMetadata {
  /** 笔记标题 */
  title: string;
  /** 创建时间 (ISO 8601 格式) */
  createdAt: string;
  /** 最后修改时间 (ISO 8601 格式) */
  updatedAt: string;
  /** 文件大小 (字节) - 可选，用于显示统计信息 */
  size?: number;
  /** 字符数统计 - 可选，用于状态栏显示 */
  characterCount?: number;
}

/**
 * 创建一个空的笔记文件内容
 */
export function createEmptyNoteFile(title: string): NoteFileContent {
  const now = new Date().toISOString();

  return {
    version: "1.0",
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
  return fileName.replace(/\.json$/, "");
}
