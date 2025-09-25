// ==================== 类型系统统一导出 ====================

// 通用基础类型
export * from "./common";

// 实体类型
export * from "./entities";

// API类型
export * from "./api";

// UI状态类型
export * from "./ui";

// 工具类型
export * from "./utils";

// 文件系统类型
export * from "./files";

// 导入 IPC 类型用于全局声明
import type { IpcMethods } from "./api";

// 全局类型声明
declare global {
  interface Window {
    electronAPI?: {
      invoke: <T extends keyof IpcMethods>(channel: T, ...args: Parameters<IpcMethods[T]>) => ReturnType<IpcMethods[T]>;
      on: (channel: string, callback: (...args: unknown[]) => void) => () => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
