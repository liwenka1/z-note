import { z } from "zod";
import { IdSchema, createStringSchema } from "./common";

/**
 * 笔记相关验证 schemas
 */

// 基础笔记 schema
export const BaseNoteSchema = z.object({
  id: IdSchema,
  tagId: IdSchema,
  content: createStringSchema("笔记内容", 0, 1000000).optional(), // 1MB限制
  locale: createStringSchema("语言设置", 1, 10),
  count: createStringSchema("字符计数", 0, 20),
  createdAt: z.number().int("创建时间必须为整数")
});

// 笔记创建 schema
export const CreateNoteSchema = z.object({
  tagId: IdSchema,
  content: createStringSchema("笔记内容", 0, 1000000).optional(),
  locale: createStringSchema("语言设置", 1, 10),
  count: createStringSchema("字符计数", 0, 20)
});

// 笔记更新 schema
export const UpdateNoteSchema = z.object({
  content: createStringSchema("笔记内容", 0, 1000000).optional(),
  locale: createStringSchema("语言设置", 1, 10).optional(),
  count: createStringSchema("字符计数", 0, 20).optional()
});

// 笔记查询参数 schema
export const GetNotesRequestSchema = z.object({
  tagId: IdSchema.optional(),
  locale: createStringSchema("语言设置", 1, 10).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "count"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional()
});

// 笔记表单数据类型（基于 schema 推导）
export type NoteFormData = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteData = z.infer<typeof UpdateNoteSchema>;
export type GetNotesRequest = z.infer<typeof GetNotesRequestSchema>;
export type Note = z.infer<typeof BaseNoteSchema>;

// 导出所有笔记相关的 schemas
export const NoteSchemas = {
  base: BaseNoteSchema,
  create: CreateNoteSchema,
  update: UpdateNoteSchema,
  getRequest: GetNotesRequestSchema
} as const;
