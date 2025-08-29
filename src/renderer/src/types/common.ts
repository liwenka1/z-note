// ==================== 基础通用类型 ====================

// ID 生成工具
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 基础错误类型
export interface AppError {
  code: string;
  message: string;
}
