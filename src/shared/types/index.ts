// ==================== 共享类型统一导出 ====================

// 核心实体类型
export * from "./entities";

// 通用基础类型
export * from "./common";

// API 相关类型
export * from "./api";

// 文件系统相关类型
export * from "./files";

// IPC 相关类型
export * from "./ipc";

// 重新导出现有的共享类型
export * from "../ocr-types";
export { IPC_CHANNELS } from "../ipc-channels";
