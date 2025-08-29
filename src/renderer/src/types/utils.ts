// ==================== 基础工具类型 ====================

import type { Note, Folder, Tag } from "./entities";

// ==================== 类型守卫函数 ====================

export const isNote = (value: unknown): value is Note =>
  typeof value === "object" && value !== null && "id" in value && "title" in value && "content" in value;

export const isFolder = (value: unknown): value is Folder =>
  typeof value === "object" && value !== null && "id" in value && "name" in value;

export const isTag = (value: unknown): value is Tag =>
  typeof value === "object" && value !== null && "id" in value && "name" in value && "color" in value;
