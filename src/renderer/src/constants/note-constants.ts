import type { NoteFileContent } from "@renderer/types/file-content";

/**
 * 笔记相关常量配置
 */
export const NOTE_CONSTANTS = {
  /**
   * 默认笔记文件版本
   */
  DEFAULT_VERSION: "1.0",

  /**
   * 默认笔记文件名前缀
   */
  DEFAULT_NOTE_PREFIX: "新建笔记",

  /**
   * 默认文件夹名前缀
   */
  DEFAULT_FOLDER_PREFIX: "新建文件夹",

  /**
   * 笔记文件扩展名
   */
  FILE_EXTENSION: ".json",

  /**
   * JSON格式化缩进
   */
  JSON_INDENT: 2
} as const;

/**
 * 创建默认的空笔记内容
 */
export function createEmptyNoteContent(): NoteFileContent["content"] {
  return {
    type: "doc",
    content: []
  };
}

/**
 * 创建默认的笔记元数据
 */
export function createDefaultMetadata(title: string): NoteFileContent["metadata"] {
  const now = new Date().toISOString();

  return {
    title,
    createdAt: now,
    updatedAt: now,
    characterCount: 0
  };
}

/**
 * 创建完整的笔记模板
 */
export function createNoteTemplate(title: string): NoteFileContent {
  return {
    version: NOTE_CONSTANTS.DEFAULT_VERSION,
    content: createEmptyNoteContent(),
    metadata: createDefaultMetadata(title)
  };
}

/**
 * 生成唯一的文件名
 */
export function generateUniqueFileName(prefix: string = NOTE_CONSTANTS.DEFAULT_NOTE_PREFIX): string {
  return `${prefix}_${Date.now()}${NOTE_CONSTANTS.FILE_EXTENSION}`;
}

/**
 * 从文件名提取标题（移除扩展名）
 */
export function extractTitleFromFileName(fileName: string): string {
  return fileName.replace(new RegExp(`\\${NOTE_CONSTANTS.FILE_EXTENSION}$`), "");
}
