// ==================== API 类型 ====================

import type {
  Note,
  Chat,
  Mark,
  Tag,
  VectorDocument,
  NoteFormData,
  ChatFormData,
  MarkFormData,
  TagFormData,
  VectorDocumentFormData
} from "./entities";
import type { BaseResponse } from "./common";

/**
 * 引入 IPC 通道常量，与后端保持同步
 */
import { IPC_CHANNELS } from "@shared/ipc-channels";

// ==================== 请求类型 ====================

export interface CreateNoteRequest {
  data: NoteFormData;
}

export interface UpdateNoteRequest {
  id: number;
  data: Partial<NoteFormData>;
}

export interface GetNotesRequest {
  tagId?: number;
  locale?: string;
  search?: string;
  sortBy?: "createdAt" | "count";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface GetChatsRequest {
  tagId?: number;
  role?: "system" | "user";
  type?: "chat" | "note" | "clipboard" | "clear";
  inserted?: boolean;
  search?: string;
  sortBy?: "createdAt" | "role" | "type";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface GetMarksRequest {
  tagId?: number;
  type?: "scan" | "text" | "image" | "link" | "file";
  includeDeleted?: boolean;
  search?: string;
  sortBy?: "createdAt" | "type";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// ==================== CRUD 操作类型 ====================

export type CreateNoteData = NoteFormData;
export type UpdateNoteData = Partial<NoteFormData>;
export type CreateChatData = ChatFormData;
export type UpdateChatData = Partial<ChatFormData>;
export type CreateMarkData = MarkFormData;
export type UpdateMarkData = Partial<MarkFormData>;
export type CreateTagData = TagFormData;
export type UpdateTagData = Partial<TagFormData>;
export type CreateVectorDocumentData = VectorDocumentFormData;
export type UpdateVectorDocumentData = Partial<VectorDocumentFormData>;

// ==================== IPC 方法类型定义 ====================

/**
 * 类型安全的IPC方法接口，使用通道常量
 */
export interface IpcMethods {
  // 数据库相关
  [IPC_CHANNELS.DB.INIT]: () => Promise<BaseResponse<{ success: boolean }>>;

  // 笔记相关
  [IPC_CHANNELS.NOTES.CREATE]: (data: CreateNoteData) => Promise<BaseResponse<Note>>;
  [IPC_CHANNELS.NOTES.GET_BY_ID]: (id: number) => Promise<BaseResponse<Note>>;
  [IPC_CHANNELS.NOTES.GET_BY_TAG]: (tagId: number) => Promise<BaseResponse<Note[]>>;
  [IPC_CHANNELS.NOTES.DELETE]: (id: number) => Promise<BaseResponse<{ id: number }>>;

  // 聊天相关
  [IPC_CHANNELS.CHATS.CREATE]: (data: CreateChatData) => Promise<BaseResponse<Chat>>;
  [IPC_CHANNELS.CHATS.GET_BY_TAG]: (tagId: number) => Promise<BaseResponse<Chat[]>>;
  [IPC_CHANNELS.CHATS.UPDATE]: (id: number, data: UpdateChatData) => Promise<BaseResponse<Chat>>;
  [IPC_CHANNELS.CHATS.DELETE]: (id: number) => Promise<BaseResponse<{ id: number }>>;
  [IPC_CHANNELS.CHATS.CLEAR_BY_TAG]: (tagId: number) => Promise<BaseResponse<{ deletedCount: number }>>;
  [IPC_CHANNELS.CHATS.UPDATE_INSERTED]: (id: number, inserted: boolean) => Promise<BaseResponse<Chat>>;

  // 标记相关
  [IPC_CHANNELS.MARKS.CREATE]: (data: CreateMarkData) => Promise<BaseResponse<Mark>>;
  [IPC_CHANNELS.MARKS.GET_BY_TAG]: (tagId: number) => Promise<BaseResponse<Mark[]>>;
  [IPC_CHANNELS.MARKS.GET_ALL]: (includeDeleted?: boolean) => Promise<BaseResponse<Mark[]>>;
  [IPC_CHANNELS.MARKS.UPDATE]: (id: number, data: UpdateMarkData) => Promise<BaseResponse<Mark>>;
  [IPC_CHANNELS.MARKS.DELETE]: (id: number) => Promise<BaseResponse<{ id: number }>>;
  [IPC_CHANNELS.MARKS.RESTORE]: (id: number) => Promise<BaseResponse<Mark>>;
  [IPC_CHANNELS.MARKS.DELETE_FOREVER]: (id: number) => Promise<BaseResponse<{ id: number }>>;
  [IPC_CHANNELS.MARKS.CLEAR_TRASH]: () => Promise<BaseResponse<{ deletedCount: number }>>;

  // 标签相关
  [IPC_CHANNELS.TAGS.CREATE]: (data: CreateTagData) => Promise<BaseResponse<Tag>>;
  [IPC_CHANNELS.TAGS.GET_ALL]: () => Promise<BaseResponse<Tag[]>>;
  [IPC_CHANNELS.TAGS.UPDATE]: (id: number, data: UpdateTagData) => Promise<BaseResponse<Tag>>;
  [IPC_CHANNELS.TAGS.DELETE]: (id: number) => Promise<BaseResponse<{ id: number }>>;
  [IPC_CHANNELS.TAGS.DELETE_ALL]: () => Promise<BaseResponse<{ deletedCount: number }>>;

  // 向量文档相关
  [IPC_CHANNELS.VECTOR.INIT]: () => Promise<BaseResponse<{ success: boolean }>>;
  [IPC_CHANNELS.VECTOR.UPSERT]: (data: VectorDocumentFormData) => Promise<BaseResponse<VectorDocument>>;
  [IPC_CHANNELS.VECTOR.GET_BY_FILENAME]: (filename: string) => Promise<BaseResponse<VectorDocument[]>>;
  [IPC_CHANNELS.VECTOR.DELETE_BY_FILENAME]: (filename: string) => Promise<BaseResponse<{ deletedCount: number }>>;
  [IPC_CHANNELS.VECTOR.GET_SIMILAR]: (embedding: string, limit?: number) => Promise<BaseResponse<VectorDocument[]>>;
  [IPC_CHANNELS.VECTOR.CLEAR]: () => Promise<BaseResponse<{ deletedCount: number }>>;
}

// ==================== IPC 事件监听器类型 ====================

export interface IpcEventListeners {
  "note-updated": (note: Note) => void;
  "note-deleted": (id: number) => void;
  "chat-updated": (chat: Chat) => void;
  "chat-deleted": (id: number) => void;
  "mark-updated": (mark: Mark) => void;
  "mark-deleted": (id: number) => void;
  "tag-updated": (tag: Tag) => void;
  "tag-deleted": (id: number) => void;
}
