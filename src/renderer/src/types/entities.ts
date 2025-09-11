// ==================== 核心实体类型 ====================

// ==================== 笔记类型 ====================

export interface Note {
  id: number;
  tagId: number;
  content?: string;
  locale: string;
  count: string;
  createdAt: number;
}

// 笔记表单数据
export type NoteFormData = Pick<Note, "tagId" | "content" | "locale" | "count">;

// ==================== 聊天类型 ====================

export interface Chat {
  id: number;
  tagId: number;
  content?: string;
  role: "system" | "user";
  type: "chat" | "note" | "clipboard" | "clear";
  image?: string;
  inserted: boolean;
  createdAt: number;
}

// 聊天表单数据
export type ChatFormData = Pick<Chat, "tagId" | "content" | "role" | "type" | "image" | "inserted">;

// ==================== 标签类型 ====================

export interface Tag {
  id: number;
  name: string;
  isLocked: boolean;
  isPin: boolean;
  noteCount?: number;
  chatCount?: number;
  markCount?: number;
}

// 标签表单数据
export type TagFormData = Pick<Tag, "name" | "isLocked" | "isPin">;

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
