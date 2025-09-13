// ==================== 文件系统相关类型定义 ====================

/**
 * 文件节点接口
 */
export interface FileNode {
  /** 文件/文件夹名称 */
  name: string;
  /** 完整路径 */
  path: string;
  /** 是否为目录 */
  isDirectory: boolean;
  /** 文件大小（字节） */
  size?: number;
  /** 修改时间 */
  modifiedTime?: Date;
  /** 创建时间 */
  createdTime?: Date;
  /** 子节点（仅目录有效） */
  children?: FileNode[];
  /** 是否正在编辑状态 */
  isEditing?: boolean;
  /** 文件扩展名 */
  extension?: string;
}

/**
 * 工作区配置接口
 */
export interface WorkspaceConfig {
  /** 工作区路径 */
  workspacePath: string;
  /** 最近打开的文件 */
  recentFiles: string[];
  /** 排除的文件模式 */
  excludePatterns: string[];
  /** 包含的文件扩展名 */
  includeExtensions: string[];
  /** 是否监听文件变化 */
  watchEnabled: boolean;
  /** 最大文件大小（字节） */
  maxFileSize: number;
  /** 其他配置 */
  [key: string]: unknown;
}

/** 工作区验证结果 */
export interface WorkspaceValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 路径是否存在 */
  exists: boolean;
  /** 是否为目录 */
  isDirectory: boolean;
  /** 是否可读 */
  readable: boolean;
  /** 是否可写 */
  writable: boolean;
  /** 错误信息 */
  error?: string;
  /** 建议 */
  suggestions?: string[];
}

/**
 * 文件扫描选项
 */
export interface ScanOptions {
  /** 是否递归扫描子目录 */
  recursive?: boolean;
  /** 是否包含隐藏文件 */
  includeHidden?: boolean;
  /** 文件过滤器函数 */
  fileFilter?: (filename: string) => boolean;
  /** 最大扫描深度 */
  maxDepth?: number;
  /** 排除的文件夹名称 */
  excludeFolders?: string[];
  /** 只包含的文件扩展名 */
  includeExtensions?: string[];
}

/**
 * 文件统计信息
 */
export interface FileStats {
  /** 是否为目录 */
  isDirectory: boolean;
  /** 是否为文件 */
  isFile: boolean;
  /** 文件大小（字节） */
  size: number;
  /** 修改时间 */
  modifiedTime: Date;
  /** 创建时间 */
  createdTime: Date;
  /** 访问时间 */
  accessedTime?: Date;
  /** 文件权限 */
  permissions?: {
    readable: boolean;
    writable: boolean;
    executable: boolean;
  };
}

/**
 * 文件搜索选项
 */
export interface SearchOptions {
  /** 是否在文件内容中搜索 */
  searchInContent?: boolean;
  /** 限制搜索的文件扩展名 */
  fileExtensions?: string[];
  /** 是否区分大小写 */
  caseSensitive?: boolean;
  /** 最大结果数量 */
  maxResults?: number;
  /** 是否使用正则表达式 */
  useRegex?: boolean;
  /** 排除的文件夹 */
  excludeFolders?: string[];
}

/**
 * 工作区验证结果
 */
export interface WorkspaceValidationResult {
  /** 是否有效 */
  isValid: boolean;
  /** 错误信息 */
  error?: string;
  /** 警告信息 */
  warnings?: string[];
  /** 建议信息 */
  suggestions?: string[];
}

/**
 * 文件操作类型
 */
export type FileOperationType = "create" | "read" | "update" | "delete" | "rename" | "move" | "copy";

/**
 * 文件操作结果
 */
export interface FileOperationResult {
  /** 操作是否成功 */
  success: boolean;
  /** 操作类型 */
  operation: FileOperationType;
  /** 源路径 */
  sourcePath?: string;
  /** 目标路径 */
  targetPath?: string;
  /** 错误信息 */
  error?: string;
  /** 操作时间戳 */
  timestamp: Date;
}

/**
 * 排序类型
 */
export type SortType = "name" | "size" | "modified" | "created" | "type";

/**
 * 排序方向
 */
export type SortDirection = "asc" | "desc";

/**
 * 文件排序选项
 */
export interface SortOptions {
  /** 排序类型 */
  type: SortType;
  /** 排序方向 */
  direction: SortDirection;
  /** 文件夹是否始终在前 */
  foldersFirst?: boolean;
}

/**
 * 文件拖拽数据
 */
export interface FileDragData {
  /** 拖拽的文件节点 */
  node: FileNode;
  /** 拖拽类型 */
  type: "move" | "copy";
  /** 源父路径 */
  sourceParent?: string;
}

/**
 * 文件上下文菜单项
 */
export interface FileContextMenuItem {
  /** 菜单项ID */
  id: string;
  /** 显示标签 */
  label: string;
  /** 图标 */
  icon?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为分隔符 */
  separator?: boolean;
  /** 子菜单 */
  submenu?: FileContextMenuItem[];
  /** 点击处理函数 */
  onClick?: (node: FileNode) => void;
}

/**
 * 文件监听事件类型
 */
export type FileWatchEventType = "add" | "change" | "unlink" | "addDir" | "unlinkDir";

/**
 * 文件监听事件
 */
export interface FileWatchEvent {
  /** 事件类型 */
  type: FileWatchEventType;
  /** 文件路径 */
  path: string;
  /** 是否为目录 */
  isDirectory: boolean;
  /** 事件时间戳 */
  timestamp: Date;
}

/**
 * 文件树状态
 */
export interface FileTreeState {
  /** 文件树数据 */
  nodes: FileNode[];
  /** 当前选中的文件路径 */
  selectedPath?: string;
  /** 展开的文件夹路径集合 */
  expandedPaths: Set<string>;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error?: string;
  /** 排序选项 */
  sortOptions: SortOptions;
}

/**
 * 工作区状态
 */
export interface WorkspaceState {
  /** 当前工作区配置 */
  config: WorkspaceConfig;
  /** 是否已初始化 */
  initialized: boolean;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 文件编辑状态
 */
export interface FileEditState {
  /** 正在编辑的文件路径 */
  filePath?: string;
  /** 文件内容 */
  content: string;
  /** 是否有未保存的更改 */
  hasUnsavedChanges: boolean;
  /** 是否正在保存 */
  saving: boolean;
  /** 最后保存时间 */
  lastSaved?: Date;
  /** 编码格式 */
  encoding?: string;
}

/**
 * 文件历史记录项
 */
export interface FileHistoryItem {
  /** 文件路径 */
  path: string;
  /** 访问时间 */
  accessedAt: Date;
  /** 文件名 */
  name: string;
  /** 是否为目录 */
  isDirectory: boolean;
}

/**
 * 搜索结果项
 */
export interface SearchResultItem extends FileNode {
  /** 匹配的行号（内容搜索时） */
  matchedLines?: number[];
  /** 匹配的文本片段 */
  matchedText?: string;
  /** 匹配分数 */
  score?: number;
}

/**
 * 文件预览数据
 */
export interface FilePreview {
  /** 文件路径 */
  path: string;
  /** 预览内容 */
  content: string;
  /** 文件类型 */
  type: "text" | "markdown" | "image" | "binary";
  /** 文件大小 */
  size: number;
  /** 是否可编辑 */
  editable: boolean;
}

/**
 * 文件导入/导出选项
 */
export interface FileImportExportOptions {
  /** 源路径或目标路径 */
  path: string;
  /** 是否递归处理 */
  recursive?: boolean;
  /** 是否覆盖现有文件 */
  overwrite?: boolean;
  /** 包含的文件类型 */
  includeTypes?: string[];
  /** 排除的文件类型 */
  excludeTypes?: string[];
  /** 进度回调 */
  onProgress?: (processed: number, total: number) => void;
}
