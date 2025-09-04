// ==================== IPC 通信基础封装 ====================

import type { IpcMethods, BaseResponse } from "@renderer/types";

/**
 * 类型安全的 IPC 调用封装
 */
class IpcClient {
  private get electronAPI() {
    if (!window.electronAPI) {
      throw new Error("Electron API 不可用，请确保在 Electron 环境中运行");
    }
    return window.electronAPI;
  }

  /**
   * 调用 IPC 方法
   */
  async invoke<T extends keyof IpcMethods>(
    channel: T,
    ...args: Parameters<IpcMethods[T]>
  ): Promise<ReturnType<IpcMethods[T]>> {
    try {
      const result = await this.electronAPI.invoke(channel, ...args);
      return result;
    } catch (error) {
      console.error(`IPC 调用失败 [${channel}]:`, error);

      // 返回错误响应
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "未知错误"
      } as ReturnType<IpcMethods[T]>;
    }
  }
}

// 导出单例实例
export const ipcClient = new IpcClient();

/**
 * 响应处理工具函数
 */
export function handleResponse<T>(response: BaseResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || "请求失败");
  }
  return response.data;
}
