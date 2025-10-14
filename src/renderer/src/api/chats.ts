// ==================== 聊天记录 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Chat, ChatFormData } from "@shared/types";
import { IPC_CHANNELS } from "@shared/ipc-channels";

export const chatsApi = {
  /**
   * 根据标签获取聊天记录
   */
  async getByTag(tagId: number): Promise<Chat[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CHATS.GET_BY_TAG, tagId);
    return handleResponse(response);
  },

  /**
   * 创建聊天记录
   */
  async create(data: ChatFormData): Promise<Chat> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CHATS.CREATE, data);
    return handleResponse(response);
  },

  /**
   * 更新聊天记录
   */
  async update(id: number, data: Partial<ChatFormData>): Promise<Chat> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CHATS.UPDATE, id, data);
    return handleResponse(response);
  },

  /**
   * 删除聊天记录
   */
  async delete(id: number): Promise<{ id: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CHATS.DELETE, id);
    return handleResponse(response);
  },

  /**
   * 清空标签下的所有聊天记录
   */
  async clearByTag(tagId: number): Promise<{ deletedCount: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CHATS.CLEAR_BY_TAG, tagId);
    return handleResponse(response);
  },

  /**
   * 更新聊天记录的插入状态
   */
  async updateInserted(id: number, inserted: boolean): Promise<Chat> {
    const response = await ipcClient.invoke(IPC_CHANNELS.CHATS.UPDATE_INSERTED, id, inserted);
    return handleResponse(response);
  }
};
