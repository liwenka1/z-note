// ==================== 标签 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Tag, TagFormData } from "@renderer/types";
import { IPC_CHANNELS } from "@shared/ipc-channels";

export const tagsApi = {
  /**
   * 获取所有标签
   */
  async getAll(): Promise<Tag[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.TAGS.GET_ALL);
    return handleResponse(response);
  },

  /**
   * 创建标签
   */
  async create(data: TagFormData): Promise<Tag> {
    const response = await ipcClient.invoke(IPC_CHANNELS.TAGS.CREATE, data);
    return handleResponse(response);
  },

  /**
   * 更新标签
   */
  async update(id: number, data: Partial<TagFormData>): Promise<Tag> {
    const response = await ipcClient.invoke(IPC_CHANNELS.TAGS.UPDATE, id, data);
    return handleResponse(response);
  },

  /**
   * 删除标签
   */
  async delete(id: number): Promise<{ id: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.TAGS.DELETE, id);
    return handleResponse(response);
  },

  /**
   * 删除所有标签
   */
  async deleteAll(): Promise<{ deletedCount: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.TAGS.DELETE_ALL);
    return handleResponse(response);
  }
};
