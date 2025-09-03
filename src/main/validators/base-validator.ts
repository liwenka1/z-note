import type { ValidationError, ValidationResult } from "./types";

/**
 * 基础验证器抽象类
 * 提供通用的验证方法和错误收集功能
 */
export abstract class BaseValidator {
  protected errors: ValidationError[] = [];

  /**
   * 添加验证错误
   */
  protected addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  /**
   * 清除所有错误
   */
  protected clearErrors(): void {
    this.errors = [];
  }

  /**
   * 获取所有错误
   */
  public getErrors(): ValidationError[] {
    return [...this.errors];
  }

  /**
   * 检查是否有效（无错误）
   */
  public isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * 获取验证结果
   */
  public getResult(): ValidationResult {
    return {
      isValid: this.isValid(),
      errors: this.getErrors()
    };
  }

  /**
   * 验证必填字段
   */
  protected validateRequired(value: unknown, fieldName: string): boolean {
    if (value === undefined || value === null || value === "") {
      this.addError(fieldName, `${fieldName}是必填项`);
      return false;
    }
    return true;
  }

  /**
   * 验证字符串长度
   */
  protected validateStringLength(value: string, fieldName: string, minLength?: number, maxLength?: number): boolean {
    let isValid = true;

    if (minLength !== undefined && value.length < minLength) {
      this.addError(fieldName, `${fieldName}长度不能少于${minLength}个字符`);
      isValid = false;
    }

    if (maxLength !== undefined && value.length > maxLength) {
      this.addError(fieldName, `${fieldName}长度不能超过${maxLength}个字符`);
      isValid = false;
    }

    return isValid;
  }

  /**
   * 验证数组长度
   */
  protected validateArrayLength(value: unknown[], fieldName: string, minLength?: number, maxLength?: number): boolean {
    let isValid = true;

    if (minLength !== undefined && value.length < minLength) {
      this.addError(fieldName, `${fieldName}数量不能少于${minLength}个`);
      isValid = false;
    }

    if (maxLength !== undefined && value.length > maxLength) {
      this.addError(fieldName, `${fieldName}数量不能超过${maxLength}个`);
      isValid = false;
    }

    return isValid;
  }

  /**
   * 验证正则表达式模式
   */
  protected validatePattern(value: string, pattern: RegExp, fieldName: string, message?: string): boolean {
    if (!pattern.test(value)) {
      this.addError(fieldName, message || `${fieldName}格式不正确`);
      return false;
    }
    return true;
  }

  /**
   * 执行自定义验证规则
   */
  protected validateCustom<T>(value: T, validator: (value: T) => boolean | string, fieldName: string): boolean {
    const result = validator(value);
    if (result === false) {
      this.addError(fieldName, `${fieldName}验证失败`);
      return false;
    } else if (typeof result === "string") {
      this.addError(fieldName, result);
      return false;
    }
    return true;
  }
}
