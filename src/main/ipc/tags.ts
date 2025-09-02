import { registerHandler } from "./registry";
import { TagsService } from "../services/tags-service";
import type { TagFormData } from "../../renderer/src/types/entities";

// 创建服务实例
const tagsService = new TagsService();

// 获取标签列表
async function getTags() {
  return tagsService.getTags();
}

// 获取单个标签
async function getTag(id: string) {
  return tagsService.getTag(id);
}

// 创建标签
async function createTag(data: TagFormData) {
  return tagsService.createTag(data);
}

// 更新标签
async function updateTag(id: string, data: Partial<TagFormData>) {
  return tagsService.updateTag(id, data);
}

// 删除标签
async function deleteTag(id: string) {
  return tagsService.deleteTag(id);
}

// 搜索标签
async function searchTags(query: string) {
  return tagsService.searchTags(query);
}

// 获取未使用的标签
async function getUnusedTags() {
  return tagsService.getUnusedTags();
}

// 获取最常用的标签
async function getMostUsedTags(limit: number = 10) {
  return tagsService.getMostUsedTags(limit);
}

// 批量删除标签
async function batchDeleteTags(ids: string[]) {
  return tagsService.batchDeleteTags(ids);
}

// 清理未使用的标签
async function cleanupUnusedTags() {
  return tagsService.cleanupUnusedTags();
}

// 注册IPC处理器
export function registerTagsHandlers() {
  registerHandler("tags:list", () => getTags());

  registerHandler("tags:get", (_event: unknown, id: string) => getTag(id));

  registerHandler("tags:create", (_event: unknown, data: TagFormData) => createTag(data));

  registerHandler("tags:update", (_event: unknown, id: string, data: Partial<TagFormData>) => updateTag(id, data));

  registerHandler("tags:delete", (_event: unknown, id: string) => deleteTag(id));

  registerHandler("tags:search", (_event: unknown, query: string) => searchTags(query));

  registerHandler("tags:unused", () => getUnusedTags());

  registerHandler("tags:most-used", (_event: unknown, limit?: number) => getMostUsedTags(limit));

  registerHandler("tags:batch-delete", (_event: unknown, ids: string[]) => batchDeleteTags(ids));

  registerHandler("tags:cleanup-unused", () => cleanupUnusedTags());
}
