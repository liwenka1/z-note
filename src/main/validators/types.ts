/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * 自定义验证规则类型
 */
export type ValidationRule<T = unknown> = (value: T) => boolean | string;

/**
 * 字段验证配置接口
 */
export interface FieldValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: ValidationRule[];
}

/**
 * 批量处理结果接口
 */
export interface BatchResult<T, R> {
  success: R[];
  errors: Array<{ item: T; error: string }>;
  successCount: number;
  errorCount: number;
}
