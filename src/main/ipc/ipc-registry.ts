import { registerHandler, registerDBHandler } from "./registry";
import { serviceManager } from "../services/service-manager";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import { initialize as initializeDatabase } from "../database/db";
import type {
  NoteFormData,
  TagFormData,
  ChatFormData,
  MarkFormData,
  VectorDocumentFormData
} from "../repositories/types";

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

    // 获取所有标签
    registerHandler(IPC_CHANNELS.TAGS.GET_ALL, async () => {
      return await tagsService.getAllTags();
    });

    // 创建标签
    registerHandler(IPC_CHANNELS.TAGS.CREATE, async (data: TagFormData) => {
      return await tagsService.createTag(data);
    });

    // 更新标签
    registerHandler(IPC_CHANNELS.TAGS.UPDATE, async (id: number, data: Partial<TagFormData>) => {
      return await tagsService.updateTag(id, data);
    });

    // 删除标签
    registerHandler(IPC_CHANNELS.TAGS.DELETE, async (id: number) => {
      return await tagsService.deleteTag(id);
    });

    // 删除所有标签
    registerHandler(IPC_CHANNELS.TAGS.DELETE_ALL, async () => {
      return await tagsService.deleteAllTags();
    });
  }

  /**
   * 笔记相关处理器
   */
  private static registerNotesHandlers(): void {
    const notesService = serviceManager.getNotesService();

    // 根据标签获取笔记
    registerHandler(IPC_CHANNELS.NOTES.GET_BY_TAG, async (tagId: number) => {
      return await notesService.getNotesByTag(tagId);
    });

    // 根据ID获取笔记
    registerHandler(IPC_CHANNELS.NOTES.GET_BY_ID, async (id: number) => {
      return await notesService.getNoteById(id);
    });

    // 创建笔记
    registerHandler(IPC_CHANNELS.NOTES.CREATE, async (data: NoteFormData) => {
      return await notesService.createNote(data);
    });

    // 删除笔记
    registerHandler(IPC_CHANNELS.NOTES.DELETE, async (id: number) => {
      return await notesService.deleteNote(id);
    });
  }

  /**
   * 聊天相关处理器
   */
  private static registerChatsHandlers(): void {
    const chatsService = serviceManager.getChatsService();

    // 根据标签获取聊天记录
    registerHandler(IPC_CHANNELS.CHATS.GET_BY_TAG, async (tagId: number) => {
      return await chatsService.getChatsByTag(tagId);
    });

    // 创建聊天记录
    registerHandler(IPC_CHANNELS.CHATS.CREATE, async (data: ChatFormData) => {
      return await chatsService.createChat(data);
    });

    // 更新聊天记录
    registerHandler(IPC_CHANNELS.CHATS.UPDATE, async (id: number, data: Partial<ChatFormData>) => {
      return await chatsService.updateChat(id, data);
    });

    // 删除聊天记录
    registerHandler(IPC_CHANNELS.CHATS.DELETE, async (id: number) => {
      return await chatsService.deleteChat(id);
    });

    // 清空标签下的聊天记录
    registerHandler(IPC_CHANNELS.CHATS.CLEAR_BY_TAG, async (tagId: number) => {
      return await chatsService.clearChatsByTag(tagId);
    });

    // 更新插入状态
    registerHandler(IPC_CHANNELS.CHATS.UPDATE_INSERTED, async (id: number, inserted: boolean) => {
      return await chatsService.updateInserted(id, inserted);
    });
  }

  /**
   * 标记相关处理器
   */
  private static registerMarksHandlers(): void {
    const marksService = serviceManager.getMarksService();

    // 根据标签获取标记
    registerHandler(IPC_CHANNELS.MARKS.GET_BY_TAG, async (tagId: number) => {
      return await marksService.getMarksByTag(tagId);
    });

    // 获取所有标记
    registerHandler(IPC_CHANNELS.MARKS.GET_ALL, async (includeDeleted?: boolean) => {
      return await marksService.getAllMarks(includeDeleted || false);
    });

    // 创建标记
    registerHandler(IPC_CHANNELS.MARKS.CREATE, async (data: MarkFormData) => {
      return await marksService.createMark(data);
    });

    // 更新标记
    registerHandler(IPC_CHANNELS.MARKS.UPDATE, async (id: number, data: Partial<MarkFormData>) => {
      return await marksService.updateMark(id, data);
    });

    // 删除标记（移至回收站）
    registerHandler(IPC_CHANNELS.MARKS.DELETE, async (id: number) => {
      return await marksService.deleteMark(id);
    });

    // 恢复标记
    registerHandler(IPC_CHANNELS.MARKS.RESTORE, async (id: number) => {
      return await marksService.restoreMark(id);
    });

    // 永久删除标记
    registerHandler(IPC_CHANNELS.MARKS.DELETE_FOREVER, async (id: number) => {
      return await marksService.deleteMarkForever(id);
    });

    // 清空回收站
    registerHandler(IPC_CHANNELS.MARKS.CLEAR_TRASH, async () => {
      return await marksService.clearTrash();
    });
  }

  /**
   * 向量文档相关处理器
   */
  private static registerVectorHandlers(): void {
    const vectorService = serviceManager.getVectorService();

    // 初始化向量数据库
    registerHandler(IPC_CHANNELS.VECTOR.INIT, async () => {
      return await vectorService.init();
    });

    // 插入或更新向量文档
    registerHandler(IPC_CHANNELS.VECTOR.UPSERT, async (data: VectorDocumentFormData) => {
      return await vectorService.upsertDocument(data);
    });

    // 根据文件名获取向量文档
    registerHandler(IPC_CHANNELS.VECTOR.GET_BY_FILENAME, async (filename: string) => {
      return await vectorService.getDocumentsByFilename(filename);
    });

    // 根据文件名删除向量文档
    registerHandler(IPC_CHANNELS.VECTOR.DELETE_BY_FILENAME, async (filename: string) => {
      return await vectorService.deleteDocumentsByFilename(filename);
    });

    // 获取相似文档
    registerHandler(IPC_CHANNELS.VECTOR.GET_SIMILAR, async (embedding: string, limit?: number) => {
      return await vectorService.getSimilarDocuments(embedding, limit || 10);
    });

    // 清空所有向量文档
    registerHandler(IPC_CHANNELS.VECTOR.CLEAR, async () => {
      return await vectorService.clearAll();
    });
  }
}
