// ==================== 渲染进程特定类型导出 ====================

// UI状态类型
export * from "./ui";

// 文件内容类型（UI特定）
export * from "./file-content";

// 文件系统类型（渲染进程特有的扩展类型）
export * from "./files";

// 全局类型声明（注意：IpcMethods 在 @shared/types 中定义）
declare global {
  interface Window {
    electronAPI?: {
      invoke: <T extends keyof import("@shared/types").IpcMethods>(
        channel: T,
        ...args: Parameters<import("@shared/types").IpcMethods[T]>
      ) => ReturnType<import("@shared/types").IpcMethods[T]>;
      on: (channel: string, callback: (...args: unknown[]) => void) => () => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
