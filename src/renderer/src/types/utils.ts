// ==================== 基础工具类型 ====================

import type { Note, Tag } from "@shared/types";

// ==================== 类型守卫函数 ====================

export const isNote = (value: unknown): value is Note =>
  typeof value === "object" && value !== null && "id" in value && "content" in value;

export const isTag = (value: unknown): value is Tag =>
  typeof value === "object" && value !== null && "id" in value && "name" in value;
