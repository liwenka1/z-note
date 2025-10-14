// ==================== 向量文档 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { VectorDocument, VectorDocumentFormData } from "@shared/types";
import { IPC_CHANNELS } from "@shared/ipc-channels";

export const vectorApi = {
  /**
   * 初始化向量数据库
   */
  async init(): Promise<{ success: boolean }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.VECTOR.INIT);
    return handleResponse(response);
  },

  /**
   * 创建或更新向量文档
   */
  async upsert(data: VectorDocumentFormData): Promise<VectorDocument> {
    const response = await ipcClient.invoke(IPC_CHANNELS.VECTOR.UPSERT, data);
    return handleResponse(response);
  },

  /**
   * 根据文件名获取向量文档
   */
  async getByFilename(filename: string): Promise<VectorDocument[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.VECTOR.GET_BY_FILENAME, filename);
    return handleResponse(response);
  },

  /**
   * 根据文件名删除向量文档
   */
  async deleteByFilename(filename: string): Promise<{ deletedCount: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.VECTOR.DELETE_BY_FILENAME, filename);
    return handleResponse(response);
  },

  /**
   * 获取相似的向量文档
   */
  async getSimilar(embedding: string, limit?: number): Promise<VectorDocument[]> {
    const response = await ipcClient.invoke(IPC_CHANNELS.VECTOR.GET_SIMILAR, embedding, limit);
    return handleResponse(response);
  },

  /**
   * 清空所有向量文档
   */
  async clear(): Promise<{ deletedCount: number }> {
    const response = await ipcClient.invoke(IPC_CHANNELS.VECTOR.CLEAR);
    return handleResponse(response);
  }
};
