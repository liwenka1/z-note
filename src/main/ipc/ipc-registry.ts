import { registerDBHandler } from "./registry";
import { serviceManager } from "../services/service-manager";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import { initialize as initializeDatabase } from "../database/db";

/**
 * IPC注册器 - 简化版
 * 只包含必要的IPC处理器
 */
export class IpcRegistry {
  /**
   * 注册所有IPC处理器
   */
  static registerAll(): void {
    // 注册数据库初始化
    this.registerDBHandlers();

    // 注册各模块处理器
    this.registerTagsHandlers();
    this.registerNotesHandlers();
    this.registerChatsHandlers();
    this.registerMarksHandlers();
    this.registerVectorHandlers();

    // 注册文件系统处理器
    this.registerFileSystemHandlers();
    this.registerWorkspaceHandlers();
    this.registerConfigHandlers();
    this.registerShellHandlers();

    // 注册 AI 处理器
    this.registerAIHandlers();

    // 注册 OCR 处理器
    this.registerOCRHandlers();

    console.log("[IpcRegistry] 所有IPC处理器注册完成");
  }

  /**
   * 数据库初始化处理器
   */
  private static registerDBHandlers(): void {
    registerDBHandler(IPC_CHANNELS.DB.INIT, async () => {
      await initializeDatabase();
      return { success: true };
    });
  }

  /**
   * 标签相关处理器
   */
  private static registerTagsHandlers(): void {
    const tagsService = serviceManager.getTagsService();
    tagsService.registerTagsHandlers();
  }

  /**
   * 笔记相关处理器
   */
  private static registerNotesHandlers(): void {
    const notesService = serviceManager.getNotesService();
    notesService.registerNotesHandlers();
  }

  /**
   * 聊天相关处理器
   */
  private static registerChatsHandlers(): void {
    const chatsService = serviceManager.getChatsService();
    chatsService.registerChatsHandlers();
  }

  /**
   * 标记相关处理器
   */
  private static registerMarksHandlers(): void {
    const marksService = serviceManager.getMarksService();
    marksService.registerMarksHandlers();
  }

  /**
   * 向量文档相关处理器
   */
  private static registerVectorHandlers(): void {
    const vectorService = serviceManager.getVectorService();
    vectorService.registerVectorHandlers();
  }

  /**
   * 文件系统相关处理器
   */
  private static registerFileSystemHandlers(): void {
    const fileSystemService = serviceManager.getFileSystemService();
    fileSystemService.registerFileSystemHandlers();
  }

  /**
   * 工作区相关处理器
   */
  private static registerWorkspaceHandlers(): void {
    const workspaceService = serviceManager.getWorkspaceService();
    workspaceService.registerWorkspaceHandlers();
  }

  /**
   * 应用配置相关处理器
   */
  private static registerConfigHandlers(): void {
    const configService = serviceManager.getConfigService();
    configService.registerConfigHandlers();
  }

  /**
   * 系统Shell操作相关处理器
   */
  private static registerShellHandlers(): void {
    const shellService = serviceManager.getShellService();
    shellService.registerShellHandlers();
  }

  /**
   * AI 相关处理器
   */
  private static registerAIHandlers(): void {
    const aiService = serviceManager.getAIService();
    aiService.registerAIHandlers();
  }

  /**
   * OCR 相关处理器
   */
  private static registerOCRHandlers(): void {
    const ocrService = serviceManager.getOCRService();
    ocrService.registerOCRHandlers();
  }
}
