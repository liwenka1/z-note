// ==================== 工具类型和守卫函数 ====================

import type { Note, Folder, Tag } from "./entities";

// ==================== 基础工具类型 ====================

// 深度可选
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 数组元素类型
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// 键值对类型
export type KeyValuePair<T> = {
  [K in keyof T]: {
    key: K;
    value: T[K];
  };
}[keyof T];

// ==================== 类型守卫函数 ====================

// 基础类型守卫
export const isString = (value: unknown): value is string => typeof value === "string";
export const isNumber = (value: unknown): value is number => typeof value === "number" && !isNaN(value);
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isArray = <T = unknown>(value: unknown): value is T[] => Array.isArray(value);
export const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// 空值检查
export const isNullish = (value: unknown): value is null | undefined => value === null || value === undefined;
export const isNotNullish = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;

// 实体类型守卫
export const isNote = (value: unknown): value is Note =>
  isObject(value) && "id" in value && "title" in value && "content" in value;

export const isFolder = (value: unknown): value is Folder =>
  isObject(value) && "id" in value && "name" in value && "parentId" in value;

export const isTag = (value: unknown): value is Tag =>
  isObject(value) && "id" in value && "name" in value && "color" in value;

// Promise检查
export const isPromise = <T = unknown>(value: unknown): value is Promise<T> => value instanceof Promise;

// 日期检查
export const isDate = (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime());

// 错误检查
export const isError = (value: unknown): value is Error => value instanceof Error;
