import { ipcMain } from "electron";

/**
 * 增强的IPC错误类
 */
export class IPCError extends Error {
  constructor(
    message: string,
    public code: string = "IPC_ERROR",
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "IPCError";
  }
}

/**
 * 标准化的API响应接口
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    context?: Record<string, unknown>;
  };
  timestamp: number;
}

/**
 * 增强的错误处理包装器
 */
export function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<R>, context?: string) {
  return async (_event: Electron.IpcMainInvokeEvent, ...args: T): Promise<APIResponse<R>> => {
    const startTime = Date.now();

    try {
      const result = await fn(...args);

      // 成功响应
      return {
        success: true,
        data: result,
        timestamp: startTime
      };
    } catch (error) {
      // 统一错误处理
      const ipcError =
        error instanceof IPCError
          ? error
          : new IPCError(error instanceof Error ? error.message : "未知错误", "IPC_ERROR", {
              context,
              originalError: error instanceof Error ? error.name : "Unknown"
            });

      // 错误日志
      console.error(`[IPC Error${context ? ` in ${context}` : ""}]:`, {
        message: ipcError.message,
        code: ipcError.code,
        context: ipcError.context,
        channel: context,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      });

      // 错误响应
      return {
        success: false,
        error: {
          message: ipcError.message,
          code: ipcError.code,
          context: ipcError.context
        },
        timestamp: startTime
      };
    }
  };
}

/**
 * 增强的IPC处理器注册函数
 * 支持错误上下文和类型安全
 */
export function registerHandler<T extends unknown[], R>(
  channel: string,
  handler: (...args: T) => Promise<R>,
  context?: string
) {
  // 使用通道名作为默认上下文
  const contextName = context || channel;
  ipcMain.handle(channel, withErrorHandling(handler, contextName));
}

/**
 * 数据库处理器注册函数（特殊处理）
 */
export function registerDBHandler<T extends unknown[], R>(channel: string, handler: (...args: T) => Promise<R>) {
  ipcMain.handle(channel, withErrorHandling(handler, `DB:${channel}`));
}

/**
 * 批量注册处理器的辅助函数
 */
export function registerHandlers(
  handlers: Array<{
    channel: string;
    handler: (...args: unknown[]) => Promise<unknown>;
    context?: string;
  }>
) {
  handlers.forEach(({ channel, handler, context }) => {
    registerHandler(channel, handler, context);
  });
}
