import { and, eq, count } from "drizzle-orm";
import { vectorDocuments } from "../database/schema";
import { BaseRepository } from "./base-repository";
import type { VectorDocument, VectorDocumentFormData } from "@shared/types";

/**
 * 向量文档Repository
 */
export class VectorRepository extends BaseRepository {
  /**
   * 插入或更新向量文档
   */
  async upsert(data: VectorDocumentFormData): Promise<VectorDocument> {
    const now = this.now();

    // 尝试查找现有记录
    const existing = await this.db
      .select()
      .from(vectorDocuments)
      .where(and(eq(vectorDocuments.filename, data.filename), eq(vectorDocuments.chunkId, data.chunkId)))
      .limit(1);

    if (existing.length > 0) {
      // 更新现有记录
      await this.db
        .update(vectorDocuments)
        .set({
          content: data.content,
          embedding: data.embedding,
          updatedAt: now
        })
        .where(and(eq(vectorDocuments.filename, data.filename), eq(vectorDocuments.chunkId, data.chunkId)));

      const result = await this.db
        .select()
        .from(vectorDocuments)
        .where(and(eq(vectorDocuments.filename, data.filename), eq(vectorDocuments.chunkId, data.chunkId)))
        .limit(1);

      return result[0] as VectorDocument;
    } else {
      // 插入新记录
      const result = await this.db
        .insert(vectorDocuments)
        .values({
          filename: data.filename,
          chunkId: data.chunkId,
          content: data.content,
          embedding: data.embedding,
          updatedAt: now
        })
        .returning();

      return result[0] as VectorDocument;
    }
  }

  /**
   * 根据文件名获取向量文档
   */
  async findByFilename(filename: string): Promise<VectorDocument[]> {
    const result = await this.db
      .select()
      .from(vectorDocuments)
      .where(eq(vectorDocuments.filename, filename))
      .orderBy(vectorDocuments.chunkId);

    return result as VectorDocument[];
  }

  /**
   * 根据文件名删除向量文档
   */
  async deleteByFilename(filename: string): Promise<{ deletedCount: number }> {
    const result = await this.db.delete(vectorDocuments).where(eq(vectorDocuments.filename, filename));

    return { deletedCount: result.changes || 0 };
  }

  /**
   * 获取相似文档（基于向量相似度计算）
   */
  async getSimilar(
    queryEmbedding: number[],
    limit: number = 5,
    threshold: number = 0.7
  ): Promise<Array<{ id: number; filename: string; content: string; similarity: number }>> {
    // 获取所有文档向量
    const docs = await this.db
      .select({
        id: vectorDocuments.id,
        filename: vectorDocuments.filename,
        content: vectorDocuments.content,
        embedding: vectorDocuments.embedding
      })
      .from(vectorDocuments);

    if (!docs.length) return [];

    // 计算余弦相似度并排序
    const results = docs
      .map((doc) => {
        try {
          const docEmbedding = JSON.parse(doc.embedding) as number[];
          const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);

          return {
            id: doc.id,
            filename: doc.filename,
            content: doc.content,
            similarity
          };
        } catch (error) {
          console.error(`Error parsing embedding for doc ${doc.id}:`, error);
          return null;
        }
      })
      .filter(
        (doc): doc is { id: number; filename: string; content: string; similarity: number } =>
          doc !== null && doc.similarity >= threshold
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  }

  /**
   * 余弦相似度计算
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("向量维度不匹配");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * 检查文件是否已存在于向量数据库中
   */
  async checkFileExists(filename: string): Promise<boolean> {
    const result = await this.db
      .select({ count: count() })
      .from(vectorDocuments)
      .where(eq(vectorDocuments.filename, filename));

    return (result[0]?.count || 0) > 0;
  }

  /**
   * 获取所有向量文档的文件名列表
   */
  async getAllFilenames(): Promise<string[]> {
    const result = await this.db.selectDistinct({ filename: vectorDocuments.filename }).from(vectorDocuments);

    return result.map((row) => row.filename);
  }

  /**
   * 清空所有向量文档
   */
  async clear(): Promise<{ deletedCount: number }> {
    const result = await this.db.delete(vectorDocuments);
    return { deletedCount: result.changes || 0 };
  }

  /**
   * 初始化向量数据库业务逻辑
   * 与其他表的简单创建不同，向量数据库需要复杂的业务初始化
   */
  async init(): Promise<{
    success: boolean;
    enabled?: boolean;
    ragEnabled?: boolean;
    error?: string;
  }> {
    try {
      // 1. 确保表结构存在（虽然已在schema中定义，但确保运行时可用）
      // 这里可以添加表完整性检查

      // 2. 检查向量数据库是否有数据
      const documentCount = await this.db.select({ count: count() }).from(vectorDocuments);

      const hasExistingData = (documentCount[0]?.count || 0) > 0;

      // 3. 返回初始化状态，供上层业务逻辑使用
      return {
        success: true,
        enabled: true, // 默认启用，具体状态由 Service 层根据配置决定
        ragEnabled: hasExistingData // 如果有数据则可以启用RAG
      };
    } catch (error) {
      console.error("Vector database initialization failed:", error);
      return {
        success: false,
        enabled: false,
        ragEnabled: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}
