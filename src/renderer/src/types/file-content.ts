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
