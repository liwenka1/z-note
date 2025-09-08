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
  tagId: IdSchema.optional(),
  locale: createStringSchema("语言设置", 1, 10).optional()
});

// 批量操作参数
export const BatchOperationSchema = z.object({
  ids: BatchIdsSchema
});

// 批量删除参数
export const BatchDeleteSchema = BatchOperationSchema;

// 批量恢复参数
export const BatchRestoreSchema = BatchOperationSchema;

// 移动到标签参数
export const MoveToTagSchema = z.object({
  noteIds: BatchIdsSchema,
  tagId: IdSchema
});

// 批量更新标签参数
export const BatchUpdateTagSchema = z.object({
  noteIds: BatchIdsSchema,
  tagId: IdSchema
});

// 排序参数
export const SortParamsSchema = z.object({
  sortBy: z.enum(["createdAt", "count", "name"]),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

// 分页查询参数
export const PaginatedQuerySchema = PaginationSchema.merge(SortParamsSchema.partial());

// API 参数类型推导
export type IdParam = z.infer<typeof IdParamSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type BatchOperation = z.infer<typeof BatchOperationSchema>;
export type MoveToTag = z.infer<typeof MoveToTagSchema>;
export type BatchUpdateTag = z.infer<typeof BatchUpdateTagSchema>;
export type SortParams = z.infer<typeof SortParamsSchema>;
export type PaginatedQuery = z.infer<typeof PaginatedQuerySchema>;

// 导出所有 API 相关的 schemas
export const ApiSchemas = {
  idParam: IdParamSchema,
  search: SearchParamsSchema,
  batchDelete: BatchDeleteSchema,
  batchRestore: BatchRestoreSchema,
  moveToTag: MoveToTagSchema,
  batchUpdateTag: BatchUpdateTagSchema,
  sort: SortParamsSchema,
  paginatedQuery: PaginatedQuerySchema
} as const;
