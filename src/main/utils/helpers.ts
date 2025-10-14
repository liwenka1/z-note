import { nanoid } from "nanoid";
import type { BaseResponse } from "@shared/types";

// 生成唯一ID
export function generateId(): string {
  return nanoid();
}

// 创建成功响应
export function createSuccessResponse<T>(data: T, message?: string): BaseResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

// 创建错误响应
export function createErrorResponse<T = null>(message: string, data: T = null as T): BaseResponse<T> {
  return {
    success: false,
    data,
    message
  };
}

// 错误处理包装器
export function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<BaseResponse<R | null>> => {
    try {
      const result = await fn(...args);
      return createSuccessResponse(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      console.error("IPC处理器错误:", message, error);
      return createErrorResponse<null>(message);
    }
  };
}
