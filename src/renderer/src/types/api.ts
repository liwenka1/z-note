// ==================== API 类型 ====================

import type { Note, Folder, Tag, NoteFormData, FolderFormData, TagFormData } from "./entities";

// ==================== 基础响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== CRUD 操作类型 ====================

export type CreateNoteData = NoteFormData;
export type UpdateNoteData = Partial<NoteFormData>;
export type CreateFolderData = FolderFormData;
export type UpdateFolderData = Partial<FolderFormData>;
export type CreateTagData = TagFormData;
export type UpdateTagData = Partial<TagFormData>;

// ==================== IPC 方法类型定义 ====================

export interface IpcMethods {
  // 笔记相关
  "notes:create": (data: CreateNoteData) => Promise<ApiResponse<Note>>;
  "notes:get": (id: string) => Promise<ApiResponse<Note>>;
  "notes:list": () => Promise<ApiResponse<Note[]>>;
  "notes:update": (id: string, data: UpdateNoteData) => Promise<ApiResponse<Note>>;
  "notes:delete": (id: string) => Promise<ApiResponse<boolean>>;

  // 文件夹相关
  "folders:create": (data: CreateFolderData) => Promise<ApiResponse<Folder>>;
  "folders:get": (id: string) => Promise<ApiResponse<Folder>>;
  "folders:list": () => Promise<ApiResponse<Folder[]>>;
  "folders:update": (id: string, data: UpdateFolderData) => Promise<ApiResponse<Folder>>;
  "folders:delete": (id: string) => Promise<ApiResponse<boolean>>;

  // 标签相关
  "tags:create": (data: CreateTagData) => Promise<ApiResponse<Tag>>;
  "tags:get": (id: string) => Promise<ApiResponse<Tag>>;
  "tags:list": () => Promise<ApiResponse<Tag[]>>;
  "tags:update": (id: string, data: UpdateTagData) => Promise<ApiResponse<Tag>>;
  "tags:delete": (id: string) => Promise<ApiResponse<boolean>>;
}

// ==================== IPC 事件监听器类型 ====================

export interface IpcEventListeners {
  "note-updated": (note: Note) => void;
  "note-deleted": (id: string) => void;
  "folder-updated": (folder: Folder) => void;
  "folder-deleted": (id: string) => void;
  "tag-updated": (tag: Tag) => void;
  "tag-deleted": (id: string) => void;
}
