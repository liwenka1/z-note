import { z } from "zod";
import { IdSchema, createStringSchema, ColorSchema } from "./common";

/**
 * 标签相关验证 schemas
 */

// 基础标签 schema
export const BaseTagSchema = z.object({
  id: IdSchema,
  name: createStringSchema("标签名称", 1, 50),
  color: ColorSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

// 标签创建 schema
export const CreateTagSchema = z.object({
  name: createStringSchema("标签名称", 1, 50),
  color: ColorSchema
});

// 标签更新 schema
export const UpdateTagSchema = z.object({
  name: createStringSchema("标签名称", 1, 50).optional(),
  color: ColorSchema
});

// 标签查询参数 schema
export const GetTagsRequestSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional()
});

// 标签表单数据类型（基于 schema 推导）
export type TagFormData = z.infer<typeof CreateTagSchema>;
export type UpdateTagData = z.infer<typeof UpdateTagSchema>;
export type GetTagsRequest = z.infer<typeof GetTagsRequestSchema>;
export type Tag = z.infer<typeof BaseTagSchema>;

// 导出所有标签相关的 schemas
export const TagSchemas = {
  base: BaseTagSchema,
  create: CreateTagSchema,
  update: UpdateTagSchema,
  getRequest: GetTagsRequestSchema,
  batchCreate: z.array(CreateTagSchema).min(1, "至少需要一个标签").max(20, "批量创建不能超过20个标签")
} as const;
