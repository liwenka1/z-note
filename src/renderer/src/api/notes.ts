// ==================== 笔记 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Note, NoteFormData } from "@shared/types";
import { IPC_CHANNELS } from "@shared/ipc-channels";

export const notesApi = {
  /**
   * 根据标签获取笔记列表
   */
  async getByTag(tagId: number): Promise<Note[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.NOTES.GET_BY_TAG, tagId);
    return handleResponse(response);
  },

  /**
   * 获取单个笔记
   */
  async getById(id: number): Promise<Note> {
    const response = await ipcClient.invoke(IPC_CHANNELS.NOTES.GET_BY_ID, id);
    return handleResponse(response);
  },

  /**
   * 创建笔记
   */
  async create(data: NoteFormData): Promise<Note> {
    const response = await ipcClient.invoke(IPC_CHANNELS.NOTES.CREATE, data);
    return handleResponse(response);
  },

  /**
   * 删除笔记
   */
  async delete(id: number): Promise<{ id: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.NOTES.DELETE, id);
    return handleResponse(response);
  }
};
