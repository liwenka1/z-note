// ==================== 通用基础类型 ====================

// 基础错误类型
export interface AppError {
  code: string;
  message: string;
}

// 基础响应类型
export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// 排序参数
export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// 分页查询参数
export interface PaginatedQuery extends Partial<Pagination>, Partial<SortParams> {
  search?: string;
  limit?: number;
  offset?: number;
}

// 批量操作结果
export interface BatchOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}
