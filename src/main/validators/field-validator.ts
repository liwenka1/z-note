import { BaseValidator } from "./base-validator";
import type { ValidationRule } from "./types";

/**
 * 字段验证器
 * 支持链式调用的验证方式
 */
export class FieldValidator extends BaseValidator {
  private fieldName: string;
  private value: unknown;

  constructor(fieldName: string, value: unknown) {
    super();
    this.fieldName = fieldName;
    this.value = value;
  }

  /**
   * 创建字段验证器实例
   */
  static create(fieldName: string, value: unknown): FieldValidator {
    return new FieldValidator(fieldName, value);
  }

  /**
   * 验证必填
   */
  required(): this {
    this.validateRequired(this.value, this.fieldName);
    return this;
  }

  /**
   * 验证字符串长度
   */
  stringLength(minLength?: number, maxLength?: number): this {
    if (typeof this.value === "string") {
      this.validateStringLength(this.value, this.fieldName, minLength, maxLength);
    } else if (this.value !== undefined && this.value !== null) {
      // 如果值不是字符串但也不是空值，则添加类型错误
      this.addError(this.fieldName, `${this.fieldName}必须是字符串类型`);
    }
    return this;
  }

  /**
   * 验证数组长度
   */
  arrayLength(minLength?: number, maxLength?: number): this {
    if (Array.isArray(this.value)) {
      this.validateArrayLength(this.value, this.fieldName, minLength, maxLength);
    } else if (this.value !== undefined && this.value !== null) {
      // 如果值不是数组但也不是空值，则添加类型错误
      this.addError(this.fieldName, `${this.fieldName}必须是数组类型`);
    }
    return this;
  }

  /**
   * 验证正则表达式模式
   */
  pattern(regex: RegExp, message?: string): this {
    if (typeof this.value === "string") {
      this.validatePattern(this.value, regex, this.fieldName, message);
    } else if (this.value !== undefined && this.value !== null) {
      this.addError(this.fieldName, `${this.fieldName}必须是字符串类型才能进行模式验证`);
    }
    return this;
  }

  /**
   * 自定义验证规则
   */
  custom<T = unknown>(validator: ValidationRule<T>): this {
    this.validateCustom(this.value as T, validator, this.fieldName);
    return this;
  }

  /**
   * 验证数字范围
   */
  numberRange(min?: number, max?: number): this {
    if (typeof this.value === "number") {
      if (min !== undefined && this.value < min) {
        this.addError(this.fieldName, `${this.fieldName}不能小于${min}`);
      }
      if (max !== undefined && this.value > max) {
        this.addError(this.fieldName, `${this.fieldName}不能大于${max}`);
      }
    } else if (this.value !== undefined && this.value !== null) {
      this.addError(this.fieldName, `${this.fieldName}必须是数字类型`);
    }
    return this;
  }

  /**
   * 验证邮箱格式
   */
  email(): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.pattern(emailRegex, `${this.fieldName}邮箱格式不正确`);
  }

  /**
   * 验证URL格式
   */
  url(): this {
    if (typeof this.value === "string") {
      try {
        new URL(this.value);
      } catch {
        this.addError(this.fieldName, `${this.fieldName}URL格式不正确`);
      }
    } else if (this.value !== undefined && this.value !== null) {
      this.addError(this.fieldName, `${this.fieldName}必须是字符串类型才能验证URL`);
    }
    return this;
  }

  /**
   * 验证非空字符串（去除空格后不为空）
   */
  notEmpty(): this {
    if (typeof this.value === "string") {
      if (this.value.trim().length === 0) {
        this.addError(this.fieldName, `${this.fieldName}不能为空`);
      }
    } else if (this.value !== undefined && this.value !== null) {
      this.addError(this.fieldName, `${this.fieldName}必须是字符串类型`);
    }
    return this;
  }

  /**
   * 执行验证并返回是否有效
   */
  validate(): boolean {
    return this.isValid();
  }

  /**
   * 执行验证，如果验证失败则抛出异常
   */
  validateOrThrow(): void {
    if (!this.isValid()) {
      const errorMessages = this.getErrors().map((error) => error.message);
      throw new Error(errorMessages.join("; "));
    }
  }
}
