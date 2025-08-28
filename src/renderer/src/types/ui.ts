// ==================== UI状态类型定义 ====================

import type { NoteId, FolderId, TagId, SortDirection } from "./common";

// ==================== 加载状态 ====================

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// ==================== 选择状态 ====================

export interface SelectionState<T = string> {
  selectedIds: T[];
  isMultiSelect: boolean;
}

// ==================== 笔记相关UI状态 ====================

export interface NotesListState {
  // 过滤条件
  selectedFolderId?: FolderId;
  selectedTagIds: TagId[];
  searchQuery: string;

  // 排序
  sortBy: "title" | "updatedAt" | "createdAt" | "wordCount";
  sortDirection: SortDirection;

  // 视图
  viewMode: "list" | "grid" | "card";

  // 选择
  selection: SelectionState<NoteId>;
}

export interface EditorState {
  // 当前编辑的笔记
  activeNoteId?: NoteId;

  // 编辑状态
  isEditing: boolean;
  hasUnsavedChanges: boolean;

  // 编辑器设置
  showPreview: boolean;
  fontSize: number;
  lineNumbers: boolean;
}

// ==================== 文件夹相关UI状态 ====================

export interface FoldersState {
  // 展开状态
  expandedFolderIds: FolderId[];

  // 选择状态
  selectedFolderId?: FolderId;

  // 拖拽状态
  dragOverFolderId?: FolderId;
}

// ==================== 搜索相关UI状态 ====================

export interface SearchState {
  // 搜索内容
  query: string;
  isActive: boolean;

  // 搜索结果
  results: AsyncState<{
    notes: NoteId[];
    folders: FolderId[];
    tags: TagId[];
  }>;

  // 搜索历史
  history: string[];
}

// ==================== 应用设置 ====================

export interface AppSettings {
  // 主题
  theme: "light" | "dark" | "system";

  // 语言
  language: "zh" | "en";

  // 编辑器设置
  editor: {
    fontSize: number;
    fontFamily: string;
    lineNumbers: boolean;
    wordWrap: boolean;
  };

  // 界面设置
  ui: {
    sidebarWidth: number;
    showActivityBar: boolean;
    compactMode: boolean;
  };
}

// ==================== 全局UI状态 ====================

export interface AppUIState {
  // 侧边栏
  sidebar: {
    isVisible: boolean;
    width: number;
    activePanel: "files" | "search" | "tags" | "settings";
  };

  // 状态栏
  statusBar: {
    isVisible: boolean;
  };

  // 模态框
  modal: {
    isOpen: boolean;
    type?: "confirm" | "create-note" | "create-folder" | "settings";
    data?: Record<string, unknown>;
  };

  // 通知
  notifications: Array<{
    id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    timestamp: Date;
  }>;
}
