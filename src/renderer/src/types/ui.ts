// ==================== 基础 UI 状态类型 ====================

import type { Note, Folder, Tag } from "./entities";

// ==================== 基础状态类型 ====================

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// ==================== 编辑器状态 ====================

export interface EditorState {
  activeNoteId?: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

// ==================== 侧边栏状态 ====================

export interface SidebarState {
  isVisible: boolean;
  activePanel: "files" | "search" | "tags";
}

// ==================== 应用主题 ====================

export type Theme = "light" | "dark";

// ==================== 模态框状态 ====================

export interface ModalState {
  isOpen: boolean;
  type?: "create-note" | "create-folder" | "create-tag" | "confirm";
  data?: Record<string, unknown>;
}

// ==================== 展示相关类型（通过entities扩展） ====================

// 笔记列表项（扩展Note实体）
export interface NoteListItem extends Pick<Note, "id" | "title" | "folderId" | "tagIds" | "isFavorite" | "updatedAt"> {
  excerpt: string; // UI计算字段
  isSelected?: boolean; // UI状态
}

// 文件夹树形项（扩展Folder实体）
export interface FolderTreeItem extends Folder {
  children: FolderTreeItem[];
  level: number;
  isExpanded?: boolean; // UI状态
}

// 带统计的标签（扩展Tag实体）
export interface TagWithStats extends Tag {
  noteCount: number; // UI计算字段
}
