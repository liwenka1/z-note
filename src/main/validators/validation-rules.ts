import { FieldValidator } from "./field-validator";

/**
 * 预定义的验证规则
 */
export const ValidationRules = {
  // 通用规则
  common: {
    required: () => (value: unknown) => value !== undefined && value !== null && value !== "",
    nonEmpty: () => (value: string) => value.trim().length > 0,
    positiveNumber: () => (value: number) => value > 0,
    nonNegativeNumber: () => (value: number) => value >= 0
  },

  // 笔记相关规则
  note: {
    title: {
      required: true,
      minLength: 1,
      maxLength: 200
    },
    content: {
      required: false,
      maxLength: 1000000 // 1MB
    },
    tags: {
      required: false,
      minLength: 0,
      maxLength: 20
    }
  },

  // 文件夹相关规则
  folder: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 100
    },
    parentId: {
      required: false
    }
  },

  // 标签相关规则
  tag: {
    name: {
      required: true,
      minLength: 1,
      maxLength: 50
    },
    color: {
      required: false,
      pattern: /^#[0-9A-Fa-f]{6}$/ // 十六进制颜色
    }
  }
} as const;

/**
 * 验证器工厂
 * 根据实体类型和字段创建预配置的验证器
 */
export class ValidatorFactory {
  /**
   * 创建笔记验证器
   */
  static createNoteValidator(data: { title?: string; content?: string; folderId?: number; tags?: string[] }): {
    title: FieldValidator;
    content: FieldValidator;
    folderId: FieldValidator;
    tags: FieldValidator;
  } {
    return {
      title: FieldValidator.create("title", data.title)
        .required()
        .stringLength(ValidationRules.note.title.minLength, ValidationRules.note.title.maxLength),

      content: FieldValidator.create("content", data.content).stringLength(
        undefined,
        ValidationRules.note.content.maxLength
      ),

      folderId: FieldValidator.create("folderId", data.folderId).custom(ValidationRules.common.nonNegativeNumber()),

      tags: FieldValidator.create("tags", data.tags).arrayLength(
        ValidationRules.note.tags.minLength,
        ValidationRules.note.tags.maxLength
      )
    };
  }

  /**
   * 创建文件夹验证器
   */
  static createFolderValidator(data: { name?: string; parentId?: number }): {
    name: FieldValidator;
    parentId: FieldValidator;
  } {
    return {
      name: FieldValidator.create("name", data.name)
        .required()
        .stringLength(ValidationRules.folder.name.minLength, ValidationRules.folder.name.maxLength),

      parentId: FieldValidator.create("parentId", data.parentId).custom(ValidationRules.common.nonNegativeNumber())
    };
  }

  /**
   * 创建标签验证器
   */
  static createTagValidator(data: { name?: string; color?: string }): {
    name: FieldValidator;
    color: FieldValidator;
  } {
    return {
      name: FieldValidator.create("name", data.name)
        .required()
        .stringLength(ValidationRules.tag.name.minLength, ValidationRules.tag.name.maxLength),

      color: FieldValidator.create("color", data.color).pattern(
        ValidationRules.tag.color.pattern!,
        "颜色格式必须为十六进制格式，如 #FF0000"
      )
    };
  }
}

/**
 * 批量验证助手
 */
export class BatchValidator {
  private validators: FieldValidator[] = [];

  /**
   * 添加验证器
   */
  add(validator: FieldValidator): this {
    this.validators.push(validator);
    return this;
  }

  /**
   * 添加多个验证器
   */
  addAll(validators: FieldValidator[]): this {
    this.validators.push(...validators);
    return this;
  }

  /**
   * 执行所有验证
   */
  validate(): boolean {
    return this.validators.every((validator) => validator.validate());
  }

  /**
   * 获取所有错误
   */
  getErrors(): Array<{ field: string; message: string }> {
    const errors: Array<{ field: string; message: string }> = [];
    for (const validator of this.validators) {
      if (!validator.isValid()) {
        errors.push(...validator.getErrors());
      }
    }
    return errors;
  }

  /**
   * 执行验证，如果失败则抛出异常
   */
  validateOrThrow(): void {
    if (!this.validate()) {
      const errors = this.getErrors();
      const errorMessages = errors.map((error) => error.message);
      throw new Error(errorMessages.join("; "));
    }
  }

  /**
   * 清空验证器
   */
  clear(): this {
    this.validators = [];
    return this;
  }
}
