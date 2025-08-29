// ==================== 核心实体类型 ====================

// ==================== 笔记类型 ====================

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tagIds: string[];
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 笔记表单数据
export type NoteFormData = Pick<Note, "title" | "content" | "folderId" | "tagIds">;

// ==================== 文件夹类型 ====================

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  color?: string;
  icon?: string;
  isDeleted: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 文件夹表单数据
export type FolderFormData = Pick<Folder, "name" | "parentId" | "color" | "icon">;

// ==================== 标签类型 ====================

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// 标签表单数据
export type TagFormData = Pick<Tag, "name" | "color">;
