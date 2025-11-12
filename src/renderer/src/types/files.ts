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
  /** 文件大小(字节) */
  size?: number;
  /** 修改时间 */
  modifiedTime?: Date;
  /** 创建时间 */
  createdTime?: Date;
  /** 子节点(仅目录有效) */
  children?: FileNode[];
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
  /** 最大文件大小(字节) */
  maxFileSize: number;
  /** 其他配置 */
  [key: string]: unknown;
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
 * 选中节点信息(统一文件和文件夹)
 */
export interface SelectedNode {
  /** 节点路径 */
  path: string;
  /** 节点类型 */
  type: "file" | "folder";
  /** 是否是目录(快速判断) */
  isDirectory: boolean;
}

/**
 * 文件树状态
 */
export interface FileTreeState {
  /** 文件树数据 */
  nodes: FileNode[];
  /** 当前选中的节点(文件或文件夹) */
  selectedNode: SelectedNode | null;
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
 * 搜索结果项
 */
export interface SearchResultItem extends FileNode {
  /** 匹配的行号(内容搜索时) */
  matchedLines?: number[];
  /** 匹配的文本片段 */
  matchedText?: string;
  /** 匹配分数 */
  score?: number;
}
