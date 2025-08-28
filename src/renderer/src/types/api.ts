// ==================== API类型定义 ====================

import type { Note, Folder, Tag, NoteFormData, FolderFormData, TagFormData } from "./entities";
import type { NoteId, FolderId, TagId, Pagination, BaseResponse } from "./common";

// ==================== 请求类型 ====================

// 笔记相关请求
export interface CreateNoteRequest {
  data: NoteFormData;
}

export interface UpdateNoteRequest {
  id: NoteId;
  data: Partial<NoteFormData>;
}

export interface GetNotesRequest {
  folderId?: FolderId;
  tagIds?: TagId[];
  search?: string;
  pagination?: Pagination;
}

export interface SearchNotesRequest {
  query: string;
  folderId?: FolderId;
  tagIds?: TagId[];
  pagination?: Pagination;
}

// 文件夹相关请求
export interface CreateFolderRequest {
  data: FolderFormData;
}

export interface UpdateFolderRequest {
  id: FolderId;
  data: Partial<FolderFormData>;
}

export interface MoveFolderRequest {
  id: FolderId;
  newParentId?: FolderId;
}

// 标签相关请求
export interface CreateTagRequest {
  data: TagFormData;
}

export interface UpdateTagRequest {
  id: TagId;
  data: Partial<TagFormData>;
}

// ==================== 响应类型 ====================

// 笔记相关响应
export interface GetNotesResponse
  extends BaseResponse<{
    notes: Note[];
    pagination?: Pagination;
  }> {}

export interface SearchNotesResponse
  extends BaseResponse<{
    notes: Note[];
    total: number;
    pagination?: Pagination;
  }> {}

// 文件夹相关响应
export interface GetFoldersResponse
  extends BaseResponse<{
    folders: Folder[];
  }> {}

// 标签相关响应
export interface GetTagsResponse
  extends BaseResponse<{
    tags: Tag[];
  }> {}

// ==================== IPC通道定义 ====================

export const IPC_CHANNELS = {
  // 笔记相关
  NOTES: {
    CREATE: "notes:create",
    GET: "notes:get",
    UPDATE: "notes:update",
    DELETE: "notes:delete",
    LIST: "notes:list",
    SEARCH: "notes:search"
  },

  // 文件夹相关
  FOLDERS: {
    CREATE: "folders:create",
    GET: "folders:get",
    UPDATE: "folders:update",
    DELETE: "folders:delete",
    LIST: "folders:list",
    MOVE: "folders:move"
  },

  // 标签相关
  TAGS: {
    CREATE: "tags:create",
    GET: "tags:get",
    UPDATE: "tags:update",
    DELETE: "tags:delete",
    LIST: "tags:list"
  }
} as const;

// IPC通道类型
export type IpcChannel =
  (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS][keyof (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]];

// ==================== IPC方法类型定义 ====================

// IPC方法映射类型
export interface IpcMethods {
  // 笔记相关
  "notes:create": (data: CreateNoteRequest) => Promise<BaseResponse<Note>>;
  "notes:get": (id: NoteId) => Promise<BaseResponse<Note>>;
  "notes:update": (data: UpdateNoteRequest) => Promise<BaseResponse<Note>>;
  "notes:delete": (id: NoteId) => Promise<BaseResponse<boolean>>;
  "notes:list": (params?: GetNotesRequest) => Promise<GetNotesResponse>;
  "notes:search": (params: SearchNotesRequest) => Promise<SearchNotesResponse>;

  // 文件夹相关
  "folders:create": (data: CreateFolderRequest) => Promise<BaseResponse<Folder>>;
  "folders:get": (id: FolderId) => Promise<BaseResponse<Folder>>;
  "folders:update": (data: UpdateFolderRequest) => Promise<BaseResponse<Folder>>;
  "folders:delete": (id: FolderId) => Promise<BaseResponse<boolean>>;
  "folders:list": () => Promise<GetFoldersResponse>;
  "folders:move": (data: MoveFolderRequest) => Promise<BaseResponse<Folder>>;

  // 标签相关
  "tags:create": (data: CreateTagRequest) => Promise<BaseResponse<Tag>>;
  "tags:get": (id: TagId) => Promise<BaseResponse<Tag>>;
  "tags:update": (data: UpdateTagRequest) => Promise<BaseResponse<Tag>>;
  "tags:delete": (id: TagId) => Promise<BaseResponse<boolean>>;
  "tags:list": () => Promise<GetTagsResponse>;
}

// IPC事件监听器类型
export interface IpcEventListeners {
  "note-updated": (note: Note) => void;
  "note-deleted": (id: NoteId) => void;
  "folder-updated": (folder: Folder) => void;
  "folder-deleted": (id: FolderId) => void;
  "tag-updated": (tag: Tag) => void;
  "tag-deleted": (id: TagId) => void;
}
