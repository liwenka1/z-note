import { NotesService } from "./notes-service";
import { FoldersService } from "./folders-service";
import { TagsService } from "./tags-service";

/**
 * 简单的服务管理器
 * 提供服务的单例管理，避免重复创建实例
 */
export class ServiceManager {
  private static instance: ServiceManager;
  private notesService?: NotesService;
  private foldersService?: FoldersService;
  private tagsService?: TagsService;

  private constructor() {
    // 私有构造函数，确保单例模式
  }

  /**
   * 获取服务管理器实例
   */
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * 获取笔记服务
   */
  getNotesService(): NotesService {
    if (!this.notesService) {
      this.notesService = new NotesService();
    }
    return this.notesService;
  }

  /**
   * 获取文件夹服务
   */
  getFoldersService(): FoldersService {
    if (!this.foldersService) {
      this.foldersService = new FoldersService();
    }
    return this.foldersService;
  }

  /**
   * 获取标签服务
   */
  getTagsService(): TagsService {
    if (!this.tagsService) {
      this.tagsService = new TagsService();
    }
    return this.tagsService;
  }

  /**
   * 重置所有服务（主要用于测试）
   */
  reset(): void {
    this.notesService = undefined;
    this.foldersService = undefined;
    this.tagsService = undefined;
  }
}

/**
 * 导出默认的服务管理器实例
 */
export const serviceManager = ServiceManager.getInstance();
