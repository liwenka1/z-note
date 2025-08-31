// ==================== 基础通用类型 ====================

import { nanoid } from "nanoid";

// ID 生成函数
export const generateId = (): string => nanoid();

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
