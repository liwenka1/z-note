// ==================== 基础 UI 状态类型 ====================

import type { Note } from "@shared/types";

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
export interface NoteListItem extends Pick<Note, "id" | "tagId" | "content" | "createdAt"> {
  excerpt: string; // UI计算字段
  isSelected?: boolean; // UI状态
}

// 文件夹树形项（基础文件夹接口）
export interface FolderTreeItem {
  id: string;
  name: string;
  path: string;
  children: FolderTreeItem[];
  level: number;
  isExpanded?: boolean; // UI状态
}
