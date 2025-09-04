import { z } from "zod";
import { IdSchema, OptionalIdSchema, createStringSchema, ColorSchema } from "./common";

/**
 * 文件夹相关验证 schemas
 */

// 基础文件夹 schema
export const BaseFolderSchema = z.object({
  id: IdSchema,
  name: createStringSchema("文件夹名称", 1, 100),
  parentId: OptionalIdSchema,
  color: ColorSchema,
  icon: z.string().optional(),
  isDeleted: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// 文件夹创建 schema
export const CreateFolderSchema = z.object({
  name: createStringSchema("文件夹名称", 1, 100),
  parentId: OptionalIdSchema,
  color: ColorSchema,
  icon: z.string().optional()
});

// 文件夹更新 schema
export const UpdateFolderSchema = z.object({
  name: createStringSchema("文件夹名称", 1, 100).optional(),
  parentId: OptionalIdSchema,
  color: ColorSchema,
  icon: z.string().optional()
});

// 文件夹查询参数 schema
export const GetFoldersRequestSchema = z.object({
  parentId: OptionalIdSchema,
  includeDeleted: z.boolean().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "sortOrder"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional()
});

// 文件夹表单数据类型（基于 schema 推导）
export type FolderFormData = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderData = z.infer<typeof UpdateFolderSchema>;
export type GetFoldersRequest = z.infer<typeof GetFoldersRequestSchema>;
export type Folder = z.infer<typeof BaseFolderSchema>;

// 导出所有文件夹相关的 schemas
export const FolderSchemas = {
  base: BaseFolderSchema,
  create: CreateFolderSchema,
  update: UpdateFolderSchema,
  getRequest: GetFoldersRequestSchema
} as const;
