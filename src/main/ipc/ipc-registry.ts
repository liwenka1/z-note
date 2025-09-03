import { registerHandler } from "./registry";
import { serviceManager } from "../services/service-manager";
import type { NoteFormData, FolderFormData, TagFormData } from "../../renderer/src/types/entities";
import type { GetNotesRequest } from "../../renderer/src/types/api";

/**
 * 统一的IPC处理器注册
 * 减少重复代码，统一错误处理
 */
export class IPCRegistry {
  /**
   * 注册所有IPC处理器
   */
  static registerAll(): void {
    this.registerNotesHandlers();
    this.registerFoldersHandlers();
    this.registerTagsHandlers();
  }

  /**
   * 注册笔记相关的IPC处理器
   */
  private static registerNotesHandlers(): void {
    const notesService = serviceManager.getNotesService();

    // 获取笔记列表
    registerHandler("notes:list", async (params?: GetNotesRequest) => {
      return await notesService.getNotes(params);
    });

    // 获取单个笔记
    registerHandler("notes:get", async (id: string) => {
      return await notesService.getNote(id);
    });

    // 创建笔记
    registerHandler("notes:create", async (data: NoteFormData) => {
      return await notesService.createNote(data);
    });

    // 更新笔记
    registerHandler("notes:update", async (id: string, data: Partial<NoteFormData>) => {
      return await notesService.updateNote(id, data);
    });

    // 删除笔记
    registerHandler("notes:delete", async (id: string) => {
      return await notesService.deleteNote(id);
    });

    // 搜索笔记
    registerHandler("notes:search", async (keyword: string) => {
      return await notesService.searchNotes(keyword);
    });

    // 恢复笔记
    registerHandler("notes:restore", async (id: string) => {
      return await notesService.restoreNote(id);
    });

    // 永久删除笔记
    registerHandler("notes:permanent-delete", async (id: string) => {
      return await notesService.permanentDeleteNote(id);
    });

    // 切换收藏状态
    registerHandler("notes:toggle-favorite", async (id: string) => {
      return await notesService.toggleFavorite(id);
    });
  }

  /**
   * 注册文件夹相关的IPC处理器
   */
  private static registerFoldersHandlers(): void {
    const foldersService = serviceManager.getFoldersService();

    // 获取文件夹列表
    registerHandler("folders:list", async () => {
      return await foldersService.getFolders();
    });

    // 获取单个文件夹
    registerHandler("folders:get", async (id: string) => {
      return await foldersService.getFolder(id);
    });

    // 创建文件夹
    registerHandler("folders:create", async (data: FolderFormData) => {
      return await foldersService.createFolder(data);
    });

    // 更新文件夹
    registerHandler("folders:update", async (id: string, data: Partial<FolderFormData>) => {
      return await foldersService.updateFolder(id, data);
    });

    // 删除文件夹
    registerHandler("folders:delete", async (id: string) => {
      return await foldersService.deleteFolder(id);
    });
  }

  /**
   * 注册标签相关的IPC处理器
   */
  private static registerTagsHandlers(): void {
    const tagsService = serviceManager.getTagsService();

    // 获取标签列表
    registerHandler("tags:list", async () => {
      return await tagsService.getTags();
    });

    // 获取单个标签
    registerHandler("tags:get", async (id: string) => {
      return await tagsService.getTag(id);
    });

    // 创建标签
    registerHandler("tags:create", async (data: TagFormData) => {
      return await tagsService.createTag(data);
    });

    // 更新标签
    registerHandler("tags:update", async (id: string, data: Partial<TagFormData>) => {
      return await tagsService.updateTag(id, data);
    });

    // 删除标签
    registerHandler("tags:delete", async (id: string) => {
      return await tagsService.deleteTag(id);
    });
  }
}
