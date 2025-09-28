import { z } from "zod";
import { IdSchema, createStringSchema } from "./common";

/**
 * 聊天相关验证 schemas
 */

// 基础聊天 schema
export const BaseChatSchema = z.object({
  id: IdSchema,
  tagId: IdSchema,
  content: createStringSchema("聊天内容", 0, 1000000).optional(), // 1MB限制
  role: z.enum(["user", "assistant", "system"]),
  type: z.enum(["chat", "note", "clipboard", "clear"]),
  image: createStringSchema("图片路径", 0, 500).optional(),
  inserted: z.boolean(),
  createdAt: z.number().int("创建时间必须为整数")
});

// 聊天创建 schema
export const CreateChatSchema = z.object({
  tagId: IdSchema,
  content: createStringSchema("聊天内容", 0, 1000000).optional(),
  role: z.enum(["user", "assistant", "system"]),
  type: z.enum(["chat", "note", "clipboard", "clear"]),
  image: createStringSchema("图片路径", 0, 500).optional(),
  inserted: z.boolean().optional().default(false)
});

// 聊天更新 schema
export const UpdateChatSchema = z.object({
  content: createStringSchema("聊天内容", 0, 1000000).optional(),
  role: z.enum(["system", "user"]).optional(),
  type: z.enum(["chat", "note", "clipboard", "clear"]).optional(),
  image: createStringSchema("图片路径", 0, 500).optional(),
  inserted: z.boolean().optional()
});

// 聊天查询参数 schema
export const GetChatsRequestSchema = z.object({
  tagId: IdSchema.optional(),
  role: z.enum(["user", "assistant", "system"]).optional(),
  type: z.enum(["chat", "note", "clipboard", "clear"]).optional(),
  inserted: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "role", "type"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.number().min(1).max(1000).optional(),
  offset: z.number().min(0).optional()
});

// 聊天表单数据类型（基于 schema 推导）
export type ChatFormData = z.infer<typeof CreateChatSchema>;
export type UpdateChatData = z.infer<typeof UpdateChatSchema>;
export type GetChatsRequest = z.infer<typeof GetChatsRequestSchema>;
export type Chat = z.infer<typeof BaseChatSchema>;

// 导出所有聊天相关的 schemas
export const ChatSchemas = {
  base: BaseChatSchema,
  create: CreateChatSchema,
  update: UpdateChatSchema,
  getRequest: GetChatsRequestSchema
} as const;
