// ==================== 核心实体类型 ====================
// 这些类型在主进程和渲染进程之间共享，确保数据结构的一致性

// ==================== 笔记类型 ====================

export interface Note {
  id: number;
  tagId: number;
  content?: string; // 统一为可选字段，兼容数据库的null值
  locale: string;
  count: string;
  createdAt: number;
}

// 笔记表单数据（创建时使用）
export type NoteFormData = Pick<Note, "tagId" | "content" | "locale" | "count">;

// 笔记更新数据（更新时使用）
export type NoteUpdateData = Partial<NoteFormData>;

// ==================== 聊天类型 ====================

export interface Chat {
  id: number;
  tagId: number;
  content?: string;
  role: "user" | "assistant" | "system";
  type: "chat" | "note" | "clipboard" | "clear";
  image?: string;
  inserted: boolean;
  createdAt: number;
}

// 聊天表单数据
export type ChatFormData = Pick<Chat, "tagId" | "content" | "role" | "type" | "image" | "inserted">;

// 聊天更新数据
export type ChatUpdateData = Partial<ChatFormData>;

// ==================== 标签类型 ====================

export interface Tag {
  id: number;
  name: string;
  isLocked: boolean;
  isPin: boolean;
}

// 标签表单数据
export type TagFormData = Pick<Tag, "name" | "isLocked" | "isPin">;

// 标签更新数据
export type TagUpdateData = Partial<TagFormData>;

// ==================== 标记类型 ====================

export interface Mark {
  id: number;
  tagId: number;
  type: "scan" | "text" | "image" | "link" | "file";
  content?: string;
  url?: string;
  desc?: string;
  deleted: number;
  createdAt?: number;
}

// 标记表单数据
export type MarkFormData = Pick<Mark, "tagId" | "type" | "content" | "url" | "desc">;

// 标记更新数据
export type MarkUpdateData = Partial<MarkFormData>;

// ==================== 向量文档类型 ====================

export interface VectorDocument {
  id: number;
  filename: string;
  chunkId: number;
  content: string;
  embedding: string;
  updatedAt: number;
}

// 向量文档表单数据
export type VectorDocumentFormData = Pick<VectorDocument, "filename" | "chunkId" | "content" | "embedding">;

// 向量文档更新数据
export type VectorDocumentUpdateData = Partial<VectorDocumentFormData>;
