// ==================== 实体类型定义 ====================

import type { NoteId, FolderId, TagId } from "./common";

// ==================== 笔记类型 ====================

export interface Note {
  id: NoteId;
  title: string;
  content: string;
  excerpt: string;

  // 关联关系
  folderId?: FolderId;
  tagIds: TagId[];

  // 状态标记
  isFavorite: boolean;
  isDeleted: boolean;

  // 内容统计
  wordCount: number;
  readingTime: number;

  // 时间戳
  createdAt: Date;
  updatedAt: Date;
  lastViewedAt?: Date;
}

// 笔记状态
export enum NoteStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived"
}

// 笔记表单数据
export interface NoteFormData {
  title: string;
  content: string;
  folderId?: FolderId;
  tagIds: TagId[];
}

// 笔记列表项
export interface NoteListItem {
  id: NoteId;
  title: string;
  excerpt: string;
  folderId?: FolderId;
  tagIds: TagId[];
  isFavorite: boolean;
  updatedAt: Date;
  wordCount: number;
}

// ==================== 文件夹类型 ====================

export interface Folder {
  id: FolderId;
  name: string;
  parentId?: FolderId;

  // 显示相关
  color?: string;
  icon?: string;
  description?: string;

  // 状态标记
  isDeleted: boolean;

  // 排序
  sortOrder: number;

  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}

// 文件夹表单数据
export interface FolderFormData {
  name: string;
  parentId?: FolderId;
  color?: string;
  icon?: string;
  description?: string;
}

// 文件夹树形结构
export interface FolderTreeItem extends Folder {
  children: FolderTreeItem[];
  level: number;
  isExpanded?: boolean; // UI状态
}

// ==================== 标签类型 ====================

export interface Tag {
  id: TagId;
  name: string;
  color: string;
  description?: string;

  // 使用统计
  usageCount: number;

  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}

// 标签表单数据
export interface TagFormData {
  name: string;
  color: string;
  description?: string;
}

// 带统计的标签
export interface TagWithStats extends Tag {
  noteCount: number;
  lastUsedAt?: Date;
}
