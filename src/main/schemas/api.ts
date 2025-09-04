import { z } from "zod";
import { IdSchema, createStringSchema, BatchIdsSchema, PaginationSchema } from "./common";

/**
 * API 参数相关验证 schemas
 */

// 单个 ID 参数
export const IdParamSchema = z.object({
  id: IdSchema
});

// 搜索参数
export const SearchParamsSchema = z.object({
  query: createStringSchema("搜索关键词", 1, 100),
  includeDeleted: z.boolean().optional().default(false),
  folderId: z.string().optional(),
  tagIds: z.array(IdSchema).optional()
});

// 批量操作参数
export const BatchOperationSchema = z.object({
  ids: BatchIdsSchema
});

// 批量删除参数
export const BatchDeleteSchema = BatchOperationSchema;

// 批量恢复参数
export const BatchRestoreSchema = BatchOperationSchema;

// 移动到文件夹参数
export const MoveToFolderSchema = z.object({
  noteIds: BatchIdsSchema,
  folderId: z.string().optional() // null 表示移到根目录
});

// 添加标签参数
export const AddTagsSchema = z.object({
  noteIds: BatchIdsSchema,
  tagIds: z.array(IdSchema).min(1, "至少选择一个标签")
});

// 移除标签参数
export const RemoveTagsSchema = z.object({
  noteIds: BatchIdsSchema,
  tagIds: z.array(IdSchema).min(1, "至少选择一个标签")
});

// 排序参数
export const SortParamsSchema = z.object({
  sortBy: z.enum(["createdAt", "updatedAt", "title", "name"]),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

// 分页查询参数
export const PaginatedQuerySchema = PaginationSchema.merge(SortParamsSchema.partial());

// API 参数类型推导
export type IdParam = z.infer<typeof IdParamSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type BatchOperation = z.infer<typeof BatchOperationSchema>;
export type MoveToFolder = z.infer<typeof MoveToFolderSchema>;
export type AddTags = z.infer<typeof AddTagsSchema>;
export type RemoveTags = z.infer<typeof RemoveTagsSchema>;
export type SortParams = z.infer<typeof SortParamsSchema>;
export type PaginatedQuery = z.infer<typeof PaginatedQuerySchema>;

// 导出所有 API 相关的 schemas
export const ApiSchemas = {
  idParam: IdParamSchema,
  search: SearchParamsSchema,
  batchDelete: BatchDeleteSchema,
  batchRestore: BatchRestoreSchema,
  moveToFolder: MoveToFolderSchema,
  addTags: AddTagsSchema,
  removeTags: RemoveTagsSchema,
  sort: SortParamsSchema,
  paginatedQuery: PaginatedQuerySchema
} as const;
