// ==================== 通用基础类型 ====================

// ID类型定义 - 使用简单的string类型
export type NoteId = string;
export type FolderId = string;
export type TagId = string;
export type UserId = string;

// ID验证和生成工具
export const isValidId = (id: unknown): id is string => {
  return typeof id === "string" && id.length > 0;
};

export const generateId = (prefix?: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
};

// 排序方向
export enum SortDirection {
  ASC = "asc",
  DESC = "desc"
}

// 基础分页类型
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// 基础响应类型
export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
