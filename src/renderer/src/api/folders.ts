// ==================== 文件夹 API 封装 ====================

import { ipcClient, handleResponse } from "./ipc";
import type { Folder, FolderFormData } from "@renderer/types";

export const foldersApi = {
  /**
   * 获取文件夹列表
   */
  async getList(): Promise<Folder[]> {
    const response = await ipcClient.invoke("folders:list");
    return handleResponse(response);
  },

  /**
   * 获取单个文件夹
   */
  async getById(id: string): Promise<Folder> {
    const response = await ipcClient.invoke("folders:get", id);
    return handleResponse(response);
  },

  /**
   * 创建文件夹
   */
  async create(data: FolderFormData): Promise<Folder> {
    const response = await ipcClient.invoke("folders:create", data);
    return handleResponse(response);
  },

  /**
   * 更新文件夹
   */
  async update(id: string, data: Partial<FolderFormData>): Promise<Folder> {
    const response = await ipcClient.invoke("folders:update", id, data);
    return handleResponse(response);
  },

  /**
   * 删除文件夹
   */
  async delete(id: string): Promise<{ id: string }> {
    const response = await ipcClient.invoke("folders:delete", id);
    return handleResponse(response);
  },

  /**
   * 恢复文件夹
   */
  async restore(id: string): Promise<Folder> {
    const response = await ipcClient.invoke("folders:restore", id);
    return handleResponse(response);
  },

  /**
   * 永久删除文件夹
   */
  async permanentDelete(id: string): Promise<{ id: string }> {
    const response = await ipcClient.invoke("folders:permanent-delete", id);
    return handleResponse(response);
  }
};
