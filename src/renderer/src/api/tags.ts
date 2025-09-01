// ==================== 标签 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Tag, TagFormData } from "@renderer/types/entities";

export const tagsApi = {
  /**
   * 获取标签列表
   */
  async getList(): Promise<Tag[]> {
    const response = await ipcClient.invoke("tags:list");
    return handleResponse(response);
  },

  /**
   * 获取单个标签
   */
  async getById(id: string): Promise<Tag> {
    const response = await ipcClient.invoke("tags:get", id);
    return handleResponse(response);
  },

  /**
   * 创建标签
   */
  async create(data: TagFormData): Promise<Tag> {
    const response = await ipcClient.invoke("tags:create", data);
    return handleResponse(response);
  },

  /**
   * 更新标签
   */
  async update(id: string, data: Partial<TagFormData>): Promise<Tag> {
    const response = await ipcClient.invoke("tags:update", id, data);
    return handleResponse(response);
  },

  /**
   * 删除标签
   */
  async delete(id: string): Promise<{ id: string }> {
    const response = await ipcClient.invoke("tags:delete", id);
    return handleResponse(response);
  }
};
