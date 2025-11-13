// ==================== 渲染进程特定的文件系统类型 ====================
// 注意: 基础文件系统类型 (FileNode, WorkspaceConfig, ScanOptions 等)
// 已在 @shared/types 中定义，此处仅定义渲染进程特有的扩展类型

import type { FileNode, WorkspaceConfig, SortOptions } from "@shared/types";

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
