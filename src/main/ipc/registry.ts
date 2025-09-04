import { ipcMain } from "electron";

/**
 * 错误处理包装器
 */
export function withErrorHandling<T extends unknown[]>(fn: (...args: T) => Promise<unknown>) {
  return async (_event: Electron.IpcMainInvokeEvent, ...args: T) => {
    try {
      const result = await fn(...args);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      console.error("IPC处理器错误:", message, error);
      return {
        success: false,
        message,
        data: null
      };
    }
  };
}

/**
 * 简单的IPC处理器注册函数
 * handle类型: handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<any>) | (any)): void;
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerHandler(channel: string, handler: (...args: any[]) => Promise<any>) {
  ipcMain.handle(channel, withErrorHandling(handler));
}
