import { registerHandler, registerDBHandler } from "./registry";
import { ipcMain } from "electron";
import { serviceManager } from "../services/service-manager";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import { initialize as initializeDatabase } from "../database/db";
import { FileSystemService } from "../services/file-system-service";
import { dialog, app, shell } from "electron";
import * as path from "path";
import type {
  NoteFormData,
  TagFormData,
  ChatFormData,
  MarkFormData,
  VectorDocumentFormData
} from "../repositories/types";
import type { WorkspaceConfig, ScanOptions } from "../services/file-system-service";

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
    registerHandler(
      IPC_CHANNELS.VECTOR.GET_SIMILAR,
      async (queryEmbedding: number[], limit?: number, threshold?: number) => {
        return await vectorService.getSimilarDocuments(queryEmbedding, limit || 5, threshold || 0.7);
      }
    );

    // 清空所有向量文档
    registerHandler(IPC_CHANNELS.VECTOR.CLEAR, async () => {
      return await vectorService.clearAll();
    });
  }

  /**
   * 文件系统相关处理器
   */
  private static registerFileSystemHandlers(): void {
    const fileSystemService = new FileSystemService();

    // 扫描目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.SCAN_DIRECTORY, async (dirPath: string, options?: ScanOptions) => {
      return await fileSystemService.scanDirectory(dirPath, options);
    });

    // 读取文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.READ_FILE, async (filePath: string) => {
      return await fileSystemService.readFile(filePath);
    });

    // 写入文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.WRITE_FILE, async (filePath: string, content: string) => {
      return await fileSystemService.writeFile(filePath, content);
    });

    // 创建目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.CREATE_DIRECTORY, async (dirPath: string) => {
      return await fileSystemService.createDirectory(dirPath);
    });

    // 删除文件或目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.DELETE_FILE, async (filePath: string) => {
      return await fileSystemService.deleteFile(filePath);
    });

    // 重命名/移动文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.RENAME_FILE, async (oldPath: string, newPath: string) => {
      return await fileSystemService.renameFile(oldPath, newPath);
    });

    // 移动文件到指定目录
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.MOVE_FILE, async (sourcePath: string, targetDir: string) => {
      return await fileSystemService.moveFile(sourcePath, targetDir);
    });

    // 复制文件
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.COPY_FILE, async (sourcePath: string, targetPath: string) => {
      return await fileSystemService.copyFile(sourcePath, targetPath);
    });

    // 检查文件是否存在
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.EXISTS, async (filePath: string) => {
      return await fileSystemService.exists(filePath);
    });

    // 获取文件统计信息
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.GET_STATS, async (filePath: string) => {
      return await fileSystemService.getStats(filePath);
    });

    // 创建唯一文件名
    registerHandler(
      IPC_CHANNELS.FILE_SYSTEM.CREATE_UNIQUE_FILENAME,
      async (dirPath: string, baseName: string, extension?: string) => {
        return await fileSystemService.createUniqueFileName(dirPath, baseName, extension);
      }
    );

    // 获取目录大小
    registerHandler(IPC_CHANNELS.FILE_SYSTEM.GET_DIRECTORY_SIZE, async (dirPath: string) => {
      return await fileSystemService.getDirectorySize(dirPath);
    });

    // 搜索文件
    registerHandler(
      IPC_CHANNELS.FILE_SYSTEM.SEARCH_FILES,
      async (
        dirPath: string,
        searchTerm: string,
        options?: {
          searchInContent?: boolean;
          fileExtensions?: string[];
          caseSensitive?: boolean;
          maxResults?: number;
        }
      ) => {
        return await fileSystemService.searchFiles(dirPath, searchTerm, options);
      }
    );
  }

  /**
   * 工作区相关处理器
   */
  private static registerWorkspaceHandlers(): void {
    const fileSystemService = new FileSystemService();

    // 获取默认工作区路径
    registerHandler(IPC_CHANNELS.WORKSPACE.GET_DEFAULT_PATH, async () => {
      return fileSystemService.getDefaultWorkspacePath();
    });

    // 获取工作区配置
    registerHandler(IPC_CHANNELS.WORKSPACE.GET_CONFIG, async () => {
      try {
        const configPath = path.join(app.getPath("userData"), "workspace-config.json");
        const exists = await fileSystemService.exists(configPath);

        if (!exists) {
          // 返回默认配置
          const defaultConfig: WorkspaceConfig = {
            path: fileSystemService.getDefaultWorkspacePath(),
            isDefault: true,
            collapsedFolders: []
          };
          return defaultConfig;
        }

        const configContent = await fileSystemService.readFile(configPath);
        return JSON.parse(configContent) as WorkspaceConfig;
      } catch (error) {
        console.error("读取工作区配置失败:", error);
        // 返回默认配置
        return {
          path: fileSystemService.getDefaultWorkspacePath(),
          isDefault: true,
          collapsedFolders: []
        } as WorkspaceConfig;
      }
    });

    // 设置工作区配置
    registerHandler(IPC_CHANNELS.WORKSPACE.SET_CONFIG, async (config: WorkspaceConfig) => {
      try {
        const configPath = path.join(app.getPath("userData"), "workspace-config.json");
        await fileSystemService.writeFile(configPath, JSON.stringify(config, null, 2));
        return { success: true };
      } catch (error) {
        console.error("保存工作区配置失败:", error);
        throw error;
      }
    });

    // 选择目录对话框
    registerHandler(IPC_CHANNELS.WORKSPACE.SELECT_DIRECTORY, async () => {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "选择工作区目录"
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      return result.filePaths[0];
    });

    // 验证工作区
    registerHandler(IPC_CHANNELS.WORKSPACE.VALIDATE_WORKSPACE, async (workspacePath: string) => {
      try {
        const exists = await fileSystemService.exists(workspacePath);
        if (!exists) {
          return { isValid: false, error: "目录不存在" };
        }

        const stats = await fileSystemService.getStats(workspacePath);
        if (!stats.isDirectory) {
          return { isValid: false, error: "路径不是目录" };
        }

        return { isValid: true };
      } catch (error) {
        return {
          isValid: false,
          error: error instanceof Error ? error.message : "验证失败"
        };
      }
    });
  }

  /**
   * 应用配置相关处理器
   */
  private static registerConfigHandlers(): void {
    const fileSystemService = new FileSystemService();

    // 获取配置
    registerHandler(IPC_CHANNELS.CONFIG.GET, async (key: string) => {
      try {
        const configPath = path.join(app.getPath("userData"), "app-config.json");
        const exists = await fileSystemService.exists(configPath);

        if (!exists) {
          return null;
        }

        const configContent = await fileSystemService.readFile(configPath);
        const config = JSON.parse(configContent);
        return config[key] || null;
      } catch (error) {
        console.error("读取配置失败:", error);
        return null;
      }
    });

    // 设置配置
    registerHandler(IPC_CHANNELS.CONFIG.SET, async (key: string, value: unknown) => {
      try {
        const configPath = path.join(app.getPath("userData"), "app-config.json");
        let config = {};

        // 读取现有配置
        const exists = await fileSystemService.exists(configPath);
        if (exists) {
          const configContent = await fileSystemService.readFile(configPath);
          config = JSON.parse(configContent);
        }

        // 更新配置
        (config as Record<string, unknown>)[key] = value;

        // 保存配置
        await fileSystemService.writeFile(configPath, JSON.stringify(config, null, 2));
        return { success: true };
      } catch (error) {
        console.error("保存配置失败:", error);
        throw error;
      }
    });

    // 删除配置
    registerHandler(IPC_CHANNELS.CONFIG.REMOVE, async (key: string) => {
      try {
        const configPath = path.join(app.getPath("userData"), "app-config.json");
        const exists = await fileSystemService.exists(configPath);

        if (!exists) {
          return { success: true }; // 文件不存在，认为删除成功
        }

        const configContent = await fileSystemService.readFile(configPath);
        const config = JSON.parse(configContent);

        delete (config as Record<string, unknown>)[key];

        await fileSystemService.writeFile(configPath, JSON.stringify(config, null, 2));
        return { success: true };
      } catch (error) {
        console.error("删除配置失败:", error);
        throw error;
      }
    });

    // 获取所有配置
    registerHandler(IPC_CHANNELS.CONFIG.GET_ALL, async () => {
      try {
        const configPath = path.join(app.getPath("userData"), "app-config.json");
        const exists = await fileSystemService.exists(configPath);

        if (!exists) {
          return {};
        }

        const configContent = await fileSystemService.readFile(configPath);
        return JSON.parse(configContent);
      } catch (error) {
        console.error("读取所有配置失败:", error);
        return {};
      }
    });
  }

  /**
   * 系统Shell操作相关处理器
   */
  private static registerShellHandlers(): void {
    // 在文件管理器中显示文件/文件夹
    registerHandler(IPC_CHANNELS.SHELL.SHOW_ITEM_IN_FOLDER, async (itemPath: string) => {
      try {
        shell.showItemInFolder(itemPath);
        return { success: true };
      } catch (error) {
        console.error("显示文件位置失败:", error);
        throw error;
      }
    });

    // 打开路径（文件夹）
    registerHandler(IPC_CHANNELS.SHELL.OPEN_PATH, async (folderPath: string) => {
      try {
        await shell.openPath(folderPath);
        return { success: true };
      } catch (error) {
        console.error("打开文件夹失败:", error);
        throw error;
      }
    });

    // 打开外部链接
    registerHandler(IPC_CHANNELS.SHELL.OPEN_EXTERNAL, async (url: string) => {
      try {
        await shell.openExternal(url);
        return { success: true };
      } catch (error) {
        console.error("打开外部链接失败:", error);
        throw error;
      }
    });
  }

  /**
   * AI 相关处理器
   */
  // 维护流式请求的 AbortController 映射
  private static streamControllers = new Map<string, AbortController>();

  private static registerAIHandlers(): void {
    // AI 聊天
    registerHandler(
      IPC_CHANNELS.AI.CHAT,
      async (
        config: {
          apiKey: string;
          baseURL: string;
          model: string;
          temperature: number;
          maxTokens: number;
        },
        messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
      ) => {
        try {
          // AI 调用
          const { generateText } = await import("ai");
          const { createOpenAI } = await import("@ai-sdk/openai");

          const openai = createOpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL
          });

          const result = await generateText({
            model: openai.chat(config.model),
            messages: messages,
            temperature: config.temperature
          });

          return {
            content: result.text,
            model: config.model,
            usage: undefined
          };
        } catch (error) {
          // 统一错误处理
          if (error instanceof Error) {
            if (error.message.includes("401") || error.message.includes("unauthorized")) {
              throw new Error("API 密钥无效，请检查配置");
            }
            if (error.message.includes("timeout") || error.message.includes("网络")) {
              throw new Error("网络连接超时，请重试");
            }
            if (error.message.includes("quota") || error.message.includes("limit")) {
              throw new Error("API 配额不足，请检查账户余额");
            }

            // 添加更多错误信息
            throw new Error(`AI 调用失败: ${error.message}`);
          }
          throw error;
        }
      }
    );

    // AI 流式聊天 (直接使用 ipcMain.handle 来访问 event 对象)
    ipcMain.handle(
      IPC_CHANNELS.AI.CHAT_STREAM,
      async (
        event: Electron.IpcMainInvokeEvent,
        config: {
          apiKey: string;
          baseURL: string;
          model: string;
          temperature: number;
          maxTokens: number;
        },
        messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
      ) => {
        try {
          const { streamText } = await import("ai");
          const { createOpenAI } = await import("@ai-sdk/openai");

          // 验证消息格式
          if (!messages || messages.length === 0) {
            throw new Error("消息不能为空");
          }

          // 创建AbortController用于中断
          const abortController = new AbortController();
          const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // 保存到映射中，用于后续中断
          IpcRegistry.streamControllers.set(streamId, abortController);

          const openai = createOpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL
          });

          const result = await streamText({
            model: openai.chat(config.model),
            messages: messages,
            temperature: config.temperature,
            abortSignal: abortController.signal
          });

          // 异步处理流式响应
          (async () => {
            try {
              let fullContent = "";
              for await (const delta of result.textStream) {
                fullContent += delta;
                // 发送累积内容到渲染进程
                event.sender.send(`ai:stream-chunk:${streamId}`, {
                  type: "chunk",
                  content: fullContent // 发送累积内容而不是增量
                });
              }

              // 流结束信号
              event.sender.send(`ai:stream-chunk:${streamId}`, {
                type: "end",
                usage: await result.usage
              });
            } catch (streamError) {
              // 流错误信号
              event.sender.send(`ai:stream-chunk:${streamId}`, {
                type: "error",
                error: streamError instanceof Error ? streamError.message : String(streamError)
              });
            } finally {
              // 清理AbortController
              IpcRegistry.streamControllers.delete(streamId);
            }
          })();

          // 立即返回流ID，让渲染进程开始监听
          return {
            success: true,
            data: {
              streamId,
              model: config.model
            },
            timestamp: Date.now()
          };
        } catch (error) {
          // 统一错误处理
          if (error instanceof Error) {
            if (error.message.includes("401") || error.message.includes("unauthorized")) {
              throw new Error("API 密钥无效，请检查配置");
            }
            if (error.message.includes("timeout") || error.message.includes("网络")) {
              throw new Error("网络连接超时，请重试");
            }
            if (error.message.includes("quota") || error.message.includes("limit")) {
              throw new Error("API 配额不足，请检查账户余额");
            }

            return {
              success: false,
              data: null,
              message: `AI 流式调用失败: ${error.message}`,
              timestamp: Date.now()
            };
          }

          return {
            success: false,
            data: null,
            message: `AI 流式调用失败: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: Date.now()
          };
        }
      }
    );

    // AI 中断流式聊天
    registerHandler(IPC_CHANNELS.AI.ABORT_STREAM, async (streamId: string) => {
      try {
        const controller = IpcRegistry.streamControllers.get(streamId);
        if (controller) {
          controller.abort();
          IpcRegistry.streamControllers.delete(streamId);
          return { success: true, streamId };
        } else {
          return { success: false, error: "流式聊天不存在或已结束" };
        }
      } catch (error) {
        throw new Error(`中断流式聊天失败: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  }
}
