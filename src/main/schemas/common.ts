import { z } from "zod";

/**
 * 通用验证 schemas
 */

// ID 验证 (改为 number 类型)
export const IdSchema = z.number().int("ID必须为整数").positive("ID必须为正数");

// 可选 ID
export const OptionalIdSchema = z.number().int("ID必须为整数").positive("ID必须为正数").optional();

// 颜色验证 (十六进制)
export const ColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "颜色格式必须为十六进制格式，如 #FF0000")
  .optional();

// 数字验证
export const PositiveNumberSchema = z.number().positive("数值必须大于0");
export const NonNegativeNumberSchema = z.number().min(0, "数值不能为负数");

// 字符串长度验证助手
export const createStringSchema = (fieldName: string, minLength?: number, maxLength?: number) => {
  let schema = z.string();

  if (minLength !== undefined) {
    schema = schema.min(minLength, `${fieldName}长度不能少于${minLength}个字符`);
  }

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, `${fieldName}长度不能超过${maxLength}个字符`);
  }

  return schema;
};

// 数组长度验证助手
export const createArraySchema = <T>(
  itemSchema: z.ZodSchema<T>,
  fieldName: string,
  minLength?: number,
  maxLength?: number
) => {
  let schema = z.array(itemSchema);

  if (minLength !== undefined) {
    schema = schema.min(minLength, `${fieldName}数量不能少于${minLength}个`);
  }

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, `${fieldName}数量不能超过${maxLength}个`);
  }

  return schema;
};

// 分页参数
export const PaginationSchema = z.object({
  page: z.number().min(1, "页码必须大于0").optional(),
  limit: z.number().min(1, "每页数量必须大于0").max(100, "每页数量不能超过100").optional(),
  offset: z.number().min(0, "偏移量不能为负数").optional()
});

// 批量操作参数
export const BatchIdsSchema = createArraySchema(IdSchema, "ID列表", 1, 100);

// 搜索关键词验证 (简化版，用于单独的搜索输入)
export const SearchQuerySchema = createStringSchema("搜索关键词", 1, 100);

// 限制数量验证
export const LimitSchema = z.number().min(1, "限制数量必须大于0").max(50, "限制数量不能超过50");
