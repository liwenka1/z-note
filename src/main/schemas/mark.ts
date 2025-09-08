import { z } from "zod";
import { IdSchema, createStringSchema } from "./common";

/**
 * 标记相关验证 schemas
 */

// 基础标记 schema
export const BaseMarkSchema = z.object({
  id: IdSchema,
  tagId: IdSchema,
  type: z.enum(["scan", "text", "image", "link", "file"]),
  content: createStringSchema("标记内容", 0, 1000000).optional(),
  url: createStringSchema("链接地址", 0, 2000).optional(),
  desc: createStringSchema("描述", 0, 500).optional(),
  deleted: z.number().min(0).max(1), // 0=正常，1=已删除
  createdAt: z.number().int("创建时间必须为整数").optional()
});

// 标记创建 schema
export const CreateMarkSchema = z.object({
  tagId: IdSchema,
  type: z.enum(["scan", "text", "image", "link", "file"]),
  content: createStringSchema("标记内容", 0, 1000000).optional(),
  url: createStringSchema("链接地址", 0, 2000).optional(),
  desc: createStringSchema("描述", 0, 500).optional()
});

// 标记更新 schema
export const UpdateMarkSchema = z.object({
  type: z.enum(["scan", "text", "image", "link", "file"]).optional(),
  content: createStringSchema("标记内容", 0, 1000000).optional(),
  url: createStringSchema("链接地址", 0, 2000).optional(),
  desc: createStringSchema("描述", 0, 500).optional()
});

// 标记查询参数 schema
export const GetMarksRequestSchema = z.object({
  tagId: IdSchema.optional(),
  type: z.enum(["scan", "text", "image", "link", "file"]).optional(),
  includeDeleted: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "type"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional()
});

// 标记表单数据类型（基于 schema 推导）
export type MarkFormData = z.infer<typeof CreateMarkSchema>;
export type UpdateMarkData = z.infer<typeof UpdateMarkSchema>;
export type GetMarksRequest = z.infer<typeof GetMarksRequestSchema>;
export type Mark = z.infer<typeof BaseMarkSchema>;

// 导出所有标记相关的 schemas
export const MarkSchemas = {
  base: BaseMarkSchema,
  create: CreateMarkSchema,
  update: UpdateMarkSchema,
  getRequest: GetMarksRequestSchema
} as const;
