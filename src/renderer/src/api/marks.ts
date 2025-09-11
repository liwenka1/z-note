// ==================== 标记收藏 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Mark, MarkFormData } from "@renderer/types";
import { IPC_CHANNELS } from "@shared/ipc-channels";

export const marksApi = {
  /**
   * 根据标签获取标记列表
   */
  async getByTag(tagId: number): Promise<Mark[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.GET_BY_TAG, tagId);
    return handleResponse(response);
  },

  /**
   * 获取所有标记
   */
  async getAll(includeDeleted?: boolean): Promise<Mark[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.GET_ALL, includeDeleted);
    return handleResponse(response);
  },

  /**
   * 创建标记
   */
  async create(data: MarkFormData): Promise<Mark> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.CREATE, data);
    return handleResponse(response);
  },

  /**
   * 更新标记
   */
  async update(id: number, data: Partial<MarkFormData>): Promise<Mark> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.UPDATE, id, data);
    return handleResponse(response);
  },

  /**
   * 删除标记（软删除）
   */
  async delete(id: number): Promise<{ id: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.DELETE, id);
    return handleResponse(response);
  },

  /**
   * 恢复标记
   */
  async restore(id: number): Promise<Mark> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.RESTORE, id);
    return handleResponse(response);
  },

  /**
   * 永久删除标记
   */
  async deleteForever(id: number): Promise<{ id: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.DELETE_FOREVER, id);
    return handleResponse(response);
  },

  /**
   * 清空回收站
   */
  async clearTrash(): Promise<{ deletedCount: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.MARKS.CLEAR_TRASH);
    return handleResponse(response);
  }
};
