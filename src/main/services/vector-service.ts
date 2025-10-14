import { VectorRepository } from "../repositories/vector-repository";
import type { VectorDocument, VectorDocumentFormData } from "@shared/types";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 向量文档服务
 */
export class VectorService {
  private vectorRepository: VectorRepository;

  constructor() {
    this.vectorRepository = new VectorRepository();
  }

  /**
   * 插入或更新向量文档
   */
  async upsertDocument(data: VectorDocumentFormData): Promise<VectorDocument> {
    return await this.vectorRepository.upsert(data);
  }

  /**
   * 根据文件名获取向量文档
   */
  async getDocumentsByFilename(filename: string): Promise<VectorDocument[]> {
    return await this.vectorRepository.findByFilename(filename);
  }

  /**
   * 根据文件名删除向量文档
   */
  async deleteDocumentsByFilename(filename: string): Promise<{ deletedCount: number }> {
    return await this.vectorRepository.deleteByFilename(filename);
  }

  /**
   * 获取相似文档
   */
  async getSimilarDocuments(
    queryEmbedding: number[],
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<Array<{ id: number; filename: string; content: string; similarity: number }>> {
    return await this.vectorRepository.getSimilar(queryEmbedding, limit, threshold);
  }

  /**
   * 检查文件是否已存在于向量数据库中
   */
  async checkFileExists(filename: string): Promise<boolean> {
    return await this.vectorRepository.checkFileExists(filename);
  }

  /**
   * 获取所有向量文档的文件名列表
   */
  async getAllFilenames(): Promise<string[]> {
    return await this.vectorRepository.getAllFilenames();
  }

  /**
   * 清空所有向量文档
   */
  async clearAll(): Promise<{ deletedCount: number }> {
    return await this.vectorRepository.clear();
  }

  /**
   * 初始化向量数据库
   * 包含复杂的业务逻辑初始化，不同于其他表的简单创建
   */
  async init(): Promise<{
    success: boolean;
    enabled?: boolean;
    ragEnabled?: boolean;
    error?: string;
    config?: {
      documentCount: number;
      lastUpdated?: number;
    };
  }> {
    try {
      // 1. 基础数据库初始化
      const dbResult = await this.vectorRepository.init();

      if (!dbResult.success) {
        return dbResult;
      }

      // 2. 获取向量数据库统计信息
      // 简单查询来获取文档总数
      const stats = await this.getVectorStats();

      // 3. 检查是否有可用数据用于RAG
      const ragEnabled = stats.documentCount > 0;

      // 4. 这里可以添加更多业务逻辑
      // - 检查AI模型配置
      // - 读取用户设置
      // - 验证向量数据完整性
      // - 清理过期数据等

      return {
        success: true,
        enabled: true,
        ragEnabled,
        config: {
          documentCount: stats.documentCount,
          lastUpdated: Date.now()
        }
      };
    } catch (error) {
      console.error("Vector service initialization failed:", error);
      return {
        success: false,
        enabled: false,
        ragEnabled: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * 获取向量数据库统计信息（内部方法）
   */
  private async getVectorStats(): Promise<{ documentCount: number }> {
    try {
      // 获取所有不同的文件名，用于统计文档数量
      const filenames = await this.vectorRepository.getAllFilenames();
      return { documentCount: filenames.length };
    } catch (error) {
      console.error("Failed to get vector stats:", error);
      return { documentCount: 0 };
    }
  }

  /**
   * 注册向量相关的 IPC 处理器
   */
  registerVectorHandlers(): void {
    // 初始化向量数据库
    registerHandler(IPC_CHANNELS.VECTOR.INIT, async () => {
      return await this.init();
    });

    // 插入或更新向量文档
    registerHandler(IPC_CHANNELS.VECTOR.UPSERT, async (data: VectorDocumentFormData) => {
      return await this.upsertDocument(data);
    });

    // 根据文件名获取向量文档
    registerHandler(IPC_CHANNELS.VECTOR.GET_BY_FILENAME, async (filename: string) => {
      return await this.getDocumentsByFilename(filename);
    });

    // 根据文件名删除向量文档
    registerHandler(IPC_CHANNELS.VECTOR.DELETE_BY_FILENAME, async (filename: string) => {
      return await this.deleteDocumentsByFilename(filename);
    });

    // 获取相似文档
    registerHandler(
      IPC_CHANNELS.VECTOR.GET_SIMILAR,
      async (queryEmbedding: number[], limit?: number, threshold?: number) => {
        return await this.getSimilarDocuments(queryEmbedding, limit || 5, threshold || 0.7);
      }
    );

    // 清空所有向量文档
    registerHandler(IPC_CHANNELS.VECTOR.CLEAR, async () => {
      return await this.clearAll();
    });
  }
}
