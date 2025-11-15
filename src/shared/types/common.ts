// ==================== 通用基础类型 ====================

/**
 * 基础响应类型
 */
export interface BaseResponse<T> {
  success: boolean;
  data: T | null; // 允许 null（错误时返回 null）
  message?: string;
  timestamp: number; // IPC 调用时间戳
}

/**
 * 分页查询参数
 */
export interface PaginatedQuery {
  search?: string;
  limit?: number;
  offset?: number;
}
