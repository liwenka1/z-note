// ==================== 核心数据类型定义 ====================

// 笔记数据类型
export interface Note {
  id: string;
  title: string;
  content: string; // Markdown 内容
  excerpt?: string; // 自动生成的摘要（前150字符）
  folderId?: string; // 所属文件夹ID
  tags: string[]; // 标签ID数组
  isFavorite: boolean; // 是否收藏
  isDeleted: boolean; // 软删除标记
  createdAt: Date;
  updatedAt: Date;
  lastViewedAt?: Date; // 最后查看时间
  wordCount: number; // 字数统计
  readingTime: number; // 预估阅读时间（分钟）
}

// 文件夹数据类型
export interface Folder {
  id: string;
  name: string;
  parentId?: string; // 父文件夹ID，支持嵌套
  color?: string; // 文件夹颜色
  icon?: string; // 自定义图标
  description?: string; // 文件夹描述
  isDeleted: boolean; // 软删除标记
  isExpanded: boolean; // 是否展开（UI状态）
  sortOrder: number; // 排序权重
  createdAt: Date;
  updatedAt: Date;

  // 计算属性（运行时计算）
  children?: Folder[]; // 子文件夹
  noteCount?: number; // 包含的笔记数量
  totalNoteCount?: number; // 包含子文件夹的总笔记数
}

// 标签数据类型
export interface Tag {
  id: string;
  name: string;
  color: string; // 标签颜色
  description?: string; // 标签描述
  usageCount: number; // 使用次数
  createdAt: Date;
  updatedAt: Date;
}

// 用户设置类型
export interface UserSettings {
  id: string;
  theme: "light" | "dark" | "system";
  fontSize: number; // 编辑器字体大小
  fontFamily: string; // 编辑器字体
  editorMode: "edit" | "preview" | "split"; // 编辑器模式
  autoSave: boolean; // 自动保存
  autoSaveInterval: number; // 自动保存间隔（秒）
  sidebarWidth: number; // 侧边栏宽度
  showLineNumbers: boolean; // 显示行号
  wordWrap: boolean; // 自动换行
  defaultFolderId?: string; // 默认文件夹
  recentNoteIds: string[]; // 最近打开的笔记
  pinnedNoteIds: string[]; // 置顶笔记
}

// 搜索历史类型
export interface SearchHistory {
  id: string;
  query: string;
  searchType: "all" | "title" | "content" | "tag";
  resultCount: number;
  searchedAt: Date;
}

// ==================== UI 状态类型 ====================

// 笔记视图模式
export type NoteViewMode = "list" | "card" | "detail";

// 排序方式
export type SortBy = "updatedAt" | "createdAt" | "title" | "wordCount";
export type SortOrder = "asc" | "desc";

// 笔记排序配置
export interface NoteSorting {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

// 笔记筛选配置
export interface NoteFilter {
  folderId?: string; // 文件夹筛选
  tagIds: string[]; // 标签筛选
  isFavorite?: boolean; // 收藏筛选
  isDeleted?: boolean; // 删除状态筛选
  dateRange?: {
    // 日期范围筛选
    start: Date;
    end: Date;
  };
  searchQuery?: string; // 搜索关键词
}

// 编辑器状态
export interface EditorState {
  currentNoteId?: string; // 当前编辑的笔记
  isEditing: boolean; // 是否在编辑模式
  hasUnsavedChanges: boolean; // 是否有未保存的更改
  cursorPosition?: {
    // 光标位置
    line: number;
    column: number;
  };
  scrollPosition?: number; // 滚动位置
}

// UI 全局状态
export interface UIState {
  sidebarCollapsed: boolean; // 侧边栏是否折叠
  selectedNoteIds: string[]; // 选中的笔记（多选）
  selectedFolderId?: string; // 选中的文件夹
  viewMode: NoteViewMode; // 笔记视图模式
  sorting: NoteSorting; // 排序配置
  filter: NoteFilter; // 筛选配置
  isLoading: boolean; // 全局加载状态
  error?: string; // 错误信息
}

// ==================== 工具类型 ====================

// 数据库操作类型
export type CreateNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt" | "wordCount" | "readingTime" | "excerpt">;
export type UpdateNoteInput = Partial<Omit<Note, "id" | "createdAt">>;

export type CreateFolderInput = Omit<
  Folder,
  "id" | "createdAt" | "updatedAt" | "isExpanded" | "noteCount" | "totalNoteCount" | "children"
>;
export type UpdateFolderInput = Partial<Omit<Folder, "id" | "createdAt" | "children" | "noteCount" | "totalNoteCount">>;

export type CreateTagInput = Omit<Tag, "id" | "createdAt" | "updatedAt" | "usageCount">;
export type UpdateTagInput = Partial<Omit<Tag, "id" | "createdAt" | "usageCount">>;

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
