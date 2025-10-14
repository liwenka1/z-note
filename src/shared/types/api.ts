// ==================== API 相关类型 ====================

import type {
  Note,
  Chat,
  Mark,
  Tag,
  VectorDocument,
  NoteFormData,
  NoteUpdateData,
  ChatFormData,
  ChatUpdateData,
  MarkFormData,
  MarkUpdateData,
  TagFormData,
  TagUpdateData,
  VectorDocumentFormData,
  VectorDocumentUpdateData
} from "./entities";
import type { BaseResponse, PaginatedQuery } from "./common";

// ==================== 请求类型 ====================

// 笔记相关请求
export interface GetNotesRequest extends PaginatedQuery {
  tagId?: number;
  locale?: string;
}

export interface CreateNoteRequest {
  data: NoteFormData;
}

export interface UpdateNoteRequest {
  id: number;
  data: NoteUpdateData;
}

// 聊天相关请求
export interface GetChatsRequest extends PaginatedQuery {
  tagId?: number;
  role?: "system" | "user" | "assistant";
  type?: "chat" | "note" | "clipboard" | "clear";
  inserted?: boolean;
}

export interface CreateChatRequest {
  data: ChatFormData;
}

export interface UpdateChatRequest {
  id: number;
  data: ChatUpdateData;
}

// 标记相关请求
export interface GetMarksRequest extends PaginatedQuery {
  tagId?: number;
  type?: "scan" | "text" | "image" | "link" | "file";
  includeDeleted?: boolean;
}

export interface CreateMarkRequest {
  data: MarkFormData;
}

export interface UpdateMarkRequest {
  id: number;
  data: MarkUpdateData;
}

// 标签相关请求
export interface CreateTagRequest {
  data: TagFormData;
}

export interface UpdateTagRequest {
  id: number;
  data: TagUpdateData;
}

// 向量文档相关请求
export interface CreateVectorDocumentRequest {
  data: VectorDocumentFormData;
}

export interface UpdateVectorDocumentRequest {
  id: number;
  data: VectorDocumentUpdateData;
}

export interface GetSimilarVectorDocumentsRequest {
  embedding: string;
  limit?: number;
}

// ==================== 响应类型 ====================

// 基础 CRUD 响应
export type NoteResponse = BaseResponse<Note>;
export type NotesResponse = BaseResponse<Note[]>;
export type ChatResponse = BaseResponse<Chat>;
export type ChatsResponse = BaseResponse<Chat[]>;
export type MarkResponse = BaseResponse<Mark>;
export type MarksResponse = BaseResponse<Mark[]>;
export type TagResponse = BaseResponse<Tag>;
export type TagsResponse = BaseResponse<Tag[]>;
export type VectorDocumentResponse = BaseResponse<VectorDocument>;
export type VectorDocumentsResponse = BaseResponse<VectorDocument[]>;

// 删除操作响应
export type DeleteResponse = BaseResponse<{ id: number }>;
export type BatchDeleteResponse = BaseResponse<{ deletedCount: number }>;

// AI 相关类型
export interface AIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIStreamResponse {
  streamId: string;
  model: string;
}

export interface AIAbortResponse {
  success: boolean;
  streamId: string;
  error?: string;
}
