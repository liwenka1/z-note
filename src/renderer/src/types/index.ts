// ==================== 渲染进程特定类型导出 ====================

// 重新导出共享类型以保持兼容性
export * from "@shared/types";

// UI状态类型
export * from "./ui";

// 工具类型
export * from "./utils";

// 文件内容类型（UI特定）
export * from "./file-content";

// 文件系统类型（UI特定的扩展，避免与共享类型冲突）
export type {
  FileTreeState,
  WorkspaceState,
  FileEditState,
  SearchResultItem,
  FileHistoryItem,
  FilePreview,
  FileImportExportOptions,
  FileDragData,
  FileContextMenuItem,
  FileWatchEvent,
  FileWatchEventType
} from "./files";

// 全局类型声明
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
