// ==================== 文件系统相关类型 ====================

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

/**
 * 工作区验证结果
 */
export interface WorkspaceValidationResult {
  /** 是否有效 */
  isValid: boolean;
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
  /** 警告信息 */
  warnings?: string[];
  /** 建议信息 */
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
