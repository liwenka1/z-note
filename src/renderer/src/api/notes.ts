// ==================== 笔记 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Note, NoteFormData, GetNotesRequest } from "@renderer/types";

export const notesApi = {
  /**
   * 获取笔记列表
   */
  async getList(params?: GetNotesRequest): Promise<Note[]> {
    const response = await ipcClient.invoke("notes:list", params);
    return handleResponse(response);
  },

  /**
   * 获取单个笔记
   */
  async getById(id: string): Promise<Note> {
    const response = await ipcClient.invoke("notes:get", id);
    return handleResponse(response);
  },

  /**
   * 创建笔记
   */
  async create(data: NoteFormData): Promise<Note> {
    const response = await ipcClient.invoke("notes:create", data);
    return handleResponse(response);
  },

  /**
   * 更新笔记
   */
  async update(id: string, data: Partial<NoteFormData>): Promise<Note> {
    const response = await ipcClient.invoke("notes:update", id, data);
    return handleResponse(response);
  },

  /**
   * 删除笔记
   */
  async delete(id: string): Promise<{ id: string }> {
    const response = await ipcClient.invoke("notes:delete", id);
    return handleResponse(response);
  },

  /**
   * 恢复笔记
   */
  async restore(id: string): Promise<Note> {
    const response = await ipcClient.invoke("notes:restore", id);
    return handleResponse(response);
  },

  /**
   * 永久删除笔记
   */
  async permanentDelete(id: string): Promise<{ id: string }> {
    const response = await ipcClient.invoke("notes:permanent-delete", id);
    return handleResponse(response);
  },

  /**
   * 切换收藏状态
   */
  async toggleFavorite(id: string): Promise<Note> {
    const response = await ipcClient.invoke("notes:toggle-favorite", id);
    return handleResponse(response);
  }
};
