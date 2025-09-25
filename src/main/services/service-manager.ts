import { NotesService } from "./notes-service";
import { TagsService } from "./tags-service";
import { ChatsService } from "./chats-service";
import { MarksService } from "./marks-service";
import { VectorService } from "./vector-service";
import { FileSystemService } from "./file-system-service";
import { WorkspaceService } from "./workspace-service";
import { ConfigService } from "./config-service";
import { ShellService } from "./shell-service";
import { AIService } from "./ai-service";

/**
 * 增强的服务管理器
 * 提供服务的单例管理，增加错误处理和状态管理
 */
export class ServiceManager {
  private static instance: ServiceManager;
  private notesService?: NotesService;
  private tagsService?: TagsService;
  private chatsService?: ChatsService;
  private marksService?: MarksService;
  private vectorService?: VectorService;
  private fileSystemService?: FileSystemService;
  private workspaceService?: WorkspaceService;
  private configService?: ConfigService;
  private shellService?: ShellService;
  private aiService?: AIService;

  // 服务状态跟踪
  private readonly serviceStatus = {
    notes: false,
    tags: false,
    chats: false,
    marks: false,
    vector: false,
    fileSystem: false,
    workspace: false,
    config: false,
    shell: false,
    ai: false
  };

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
   * 获取笔记服务（带错误处理）
   */
  getNotesService(): NotesService {
    if (!this.notesService) {
      try {
        this.notesService = new NotesService();
        this.serviceStatus.notes = true;
        console.log("[ServiceManager] NotesService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] NotesService 初始化失败:", error);
        throw new Error(`NotesService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.notesService;
  }

  /**
   * 获取标签服务（带错误处理）
   */
  getTagsService(): TagsService {
    if (!this.tagsService) {
      try {
        this.tagsService = new TagsService();
        this.serviceStatus.tags = true;
        console.log("[ServiceManager] TagsService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] TagsService 初始化失败:", error);
        throw new Error(`TagsService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.tagsService;
  }

  /**
   * 获取聊天服务（带错误处理）
   */
  getChatsService(): ChatsService {
    if (!this.chatsService) {
      try {
        this.chatsService = new ChatsService();
        this.serviceStatus.chats = true;
        console.log("[ServiceManager] ChatsService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] ChatsService 初始化失败:", error);
        throw new Error(`ChatsService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.chatsService;
  }

  /**
   * 获取标记服务（带错误处理）
   */
  getMarksService(): MarksService {
    if (!this.marksService) {
      try {
        this.marksService = new MarksService();
        this.serviceStatus.marks = true;
        console.log("[ServiceManager] MarksService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] MarksService 初始化失败:", error);
        throw new Error(`MarksService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.marksService;
  }

  /**
   * 获取向量服务
   */
  getVectorService(): VectorService {
    if (!this.vectorService) {
      try {
        this.vectorService = new VectorService();
        this.serviceStatus.vector = true;
        console.log("[ServiceManager] VectorService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] VectorService 初始化失败:", error);
        throw new Error(`VectorService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.vectorService;
  }

  /**
   * 获取文件系统服务
   */
  getFileSystemService(): FileSystemService {
    if (!this.fileSystemService) {
      try {
        this.fileSystemService = new FileSystemService();
        this.serviceStatus.fileSystem = true;
        console.log("[ServiceManager] FileSystemService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] FileSystemService 初始化失败:", error);
        throw new Error(`FileSystemService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.fileSystemService;
  }

  /**
   * 获取工作区服务
   */
  getWorkspaceService(): WorkspaceService {
    if (!this.workspaceService) {
      try {
        this.workspaceService = new WorkspaceService();
        this.serviceStatus.workspace = true;
        console.log("[ServiceManager] WorkspaceService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] WorkspaceService 初始化失败:", error);
        throw new Error(`WorkspaceService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.workspaceService;
  }

  /**
   * 获取配置服务
   */
  getConfigService(): ConfigService {
    if (!this.configService) {
      try {
        this.configService = new ConfigService();
        this.serviceStatus.config = true;
        console.log("[ServiceManager] ConfigService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] ConfigService 初始化失败:", error);
        throw new Error(`ConfigService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.configService;
  }

  /**
   * 获取Shell服务
   */
  getShellService(): ShellService {
    if (!this.shellService) {
      try {
        this.shellService = new ShellService();
        this.serviceStatus.shell = true;
        console.log("[ServiceManager] ShellService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] ShellService 初始化失败:", error);
        throw new Error(`ShellService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.shellService;
  }

  /**
   * 获取AI服务
   */
  getAIService(): AIService {
    if (!this.aiService) {
      try {
        this.aiService = new AIService();
        this.serviceStatus.ai = true;
        console.log("[ServiceManager] AIService 初始化成功");
      } catch (error) {
        console.error("[ServiceManager] AIService 初始化失败:", error);
        throw new Error(`AIService初始化失败: ${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    return this.aiService;
  }

  /**
   * 获取服务状态
   */
  getServiceStatus() {
    return { ...this.serviceStatus };
  }

  /**
   * 检查所有服务是否正常
   */
  isHealthy(): boolean {
    return Object.values(this.serviceStatus).every((status) => status);
  }

  /**
   * 重置所有服务（主要用于测试）
   */
  reset(): void {
    this.notesService = undefined;
    this.tagsService = undefined;
    this.chatsService = undefined;
    this.marksService = undefined;
    this.vectorService = undefined;
    this.fileSystemService = undefined;
    this.workspaceService = undefined;
    this.configService = undefined;
    this.shellService = undefined;
    this.aiService = undefined;

    // 重置状态
    this.serviceStatus.notes = false;
    this.serviceStatus.tags = false;
    this.serviceStatus.chats = false;
    this.serviceStatus.marks = false;
    this.serviceStatus.vector = false;
    this.serviceStatus.fileSystem = false;
    this.serviceStatus.workspace = false;
    this.serviceStatus.config = false;
    this.serviceStatus.shell = false;
    this.serviceStatus.ai = false;

    console.log("[ServiceManager] 所有服务已重置");
  }
}

/**
 * 导出默认的服务管理器实例
 */
export const serviceManager = ServiceManager.getInstance();
