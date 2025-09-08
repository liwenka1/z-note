import { z } from "zod";

/**
 * Vector Document 相关的 Zod schema 定义
 */

// Vector Document 表单数据验证
export const vectorDocumentFormSchema = z.object({
  filename: z.string().min(1, "文件名不能为空"),
  chunkId: z.number().min(0, "分块ID必须大于等于0"),
  content: z.string().min(1, "内容不能为空"),
  embedding: z.string().min(1, "向量数据不能为空")
});

// Vector Document 实体验证
export const vectorDocumentEntitySchema = z.object({
  id: z.number(),
  filename: z.string(),
  chunkId: z.number(),
  content: z.string(),
  embedding: z.string(),
  updatedAt: z.number()
});

// 向量搜索参数验证
export const vectorSearchParamsSchema = z.object({
  embedding: z.string().min(1, "向量数据不能为空"),
  limit: z.number().min(1).max(100).optional().default(10)
});

// 文件名参数验证
export const filenameParamsSchema = z.object({
  filename: z.string().min(1, "文件名不能为空")
});

export type VectorDocumentFormData = z.infer<typeof vectorDocumentFormSchema>;
export type VectorDocumentEntity = z.infer<typeof vectorDocumentEntitySchema>;
export type VectorSearchParams = z.infer<typeof vectorSearchParamsSchema>;
export type FilenameParams = z.infer<typeof filenameParamsSchema>;
