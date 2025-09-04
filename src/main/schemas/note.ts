import { z } from "zod";
import { IdSchema, OptionalIdSchema, createStringSchema, createArraySchema } from "./common";

/**
 * 笔记相关验证 schemas
 */

// 基础笔记 schema
export const BaseNoteSchema = z.object({
  id: IdSchema,
  title: createStringSchema("笔记标题", 1, 200),
  content: createStringSchema("笔记内容", 0, 1000000), // 1MB限制
  folderId: OptionalIdSchema,
  tagIds: createArraySchema(IdSchema, "标签", 0, 20),
  isFavorite: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// 笔记创建 schema
export const CreateNoteSchema = z.object({
  title: createStringSchema("笔记标题", 1, 200),
  content: createStringSchema("笔记内容", 0, 1000000).optional().default(""),
  folderId: OptionalIdSchema,
  tagIds: createArraySchema(IdSchema, "标签", 0, 20).optional().default([])
});

// 笔记更新 schema
export const UpdateNoteSchema = z.object({
  title: createStringSchema("笔记标题", 1, 200).optional(),
  content: createStringSchema("笔记内容", 0, 1000000).optional(),
  folderId: OptionalIdSchema,
  tagIds: createArraySchema(IdSchema, "标签", 0, 20).optional()
});

// 笔记查询参数 schema
export const GetNotesRequestSchema = z.object({
  folderId: OptionalIdSchema,
  tagIds: z.array(IdSchema).optional(),
  includeDeleted: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
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
