import { VectorRepository } from "../repositories/vector-repository";
import type { VectorDocumentFormData, VectorDocumentEntity } from "../repositories/types";

/**
 * 向量文档服务
 */
export class VectorService {
  private vectorRepository: VectorRepository;

  constructor() {
    this.vectorRepository = new VectorRepository();
  }

  /**
   * 初始化向量数据库
   */
  async init(): Promise<{ success: boolean }> {
    return await this.vectorRepository.init();
  }

  /**
   * 插入或更新向量文档
   */
  async upsertDocument(data: VectorDocumentFormData): Promise<VectorDocumentEntity> {
    return await this.vectorRepository.upsert(data);
  }

  /**
   * 根据文件名获取向量文档
   */
  async getDocumentsByFilename(filename: string): Promise<VectorDocumentEntity[]> {
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
  async getSimilarDocuments(embedding: string, limit: number = 10): Promise<VectorDocumentEntity[]> {
    return await this.vectorRepository.getSimilar(embedding, limit);
  }

  /**
   * 清空所有向量文档
   */
  async clearAll(): Promise<{ deletedCount: number }> {
    return await this.vectorRepository.clear();
  }
}
