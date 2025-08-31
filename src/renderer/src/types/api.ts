// ==================== API 类型 ====================

import type { Note, Folder, Tag, NoteFormData, FolderFormData, TagFormData } from "./entities";
import type { BaseResponse } from "./common";

// ==================== 请求类型 ====================

export interface CreateNoteRequest {
  data: NoteFormData;
}

export interface UpdateNoteRequest {
  id: string;
  data: Partial<NoteFormData>;
}

export interface GetNotesRequest {
  folderId?: string;
  tagIds?: string[];
  search?: string;
  includeDeleted?: boolean;
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
  "notes:create": (data: CreateNoteData) => Promise<BaseResponse<Note>>;
  "notes:get": (id: string) => Promise<BaseResponse<Note>>;
  "notes:list": (params?: GetNotesRequest) => Promise<BaseResponse<Note[]>>;
  "notes:update": (id: string, data: UpdateNoteData) => Promise<BaseResponse<Note>>;
  "notes:delete": (id: string) => Promise<BaseResponse<{ id: string }>>;
  "notes:restore": (id: string) => Promise<BaseResponse<Note>>;
  "notes:permanent-delete": (id: string) => Promise<BaseResponse<{ id: string }>>;
  "notes:toggle-favorite": (id: string) => Promise<BaseResponse<Note>>;

  // 文件夹相关
  "folders:create": (data: CreateFolderData) => Promise<BaseResponse<Folder>>;
  "folders:get": (id: string) => Promise<BaseResponse<Folder>>;
  "folders:list": () => Promise<BaseResponse<Folder[]>>;
  "folders:update": (id: string, data: UpdateFolderData) => Promise<BaseResponse<Folder>>;
  "folders:delete": (id: string) => Promise<BaseResponse<{ id: string }>>;
  "folders:restore": (id: string) => Promise<BaseResponse<Folder>>;
  "folders:permanent-delete": (id: string) => Promise<BaseResponse<{ id: string }>>;

  // 标签相关
  "tags:create": (data: CreateTagData) => Promise<BaseResponse<Tag>>;
  "tags:get": (id: string) => Promise<BaseResponse<Tag>>;
  "tags:list": () => Promise<BaseResponse<Tag[]>>;
  "tags:update": (id: string, data: UpdateTagData) => Promise<BaseResponse<Tag>>;
  "tags:delete": (id: string) => Promise<BaseResponse<{ id: string }>>;
  "tags:stats": (id: string) => Promise<BaseResponse<{ tagId: string; tagName: string; noteCount: number }>>;
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
