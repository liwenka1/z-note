import { eq, sql } from "drizzle-orm";
import { vectorDocuments } from "../database/schema";
import { BaseRepository } from "./base-repository";

export interface VectorDocumentFormData {
  filename: string;
  chunkId: number;
  content: string;
  embedding: string; // JSON 字符串
}

export interface VectorDocumentEntity {
  id: number;
  filename: string;
  chunkId: number;
  content: string;
  embedding: string;
  updatedAt: number;
}

/**
 * 向量文档Repository
 */
export class VectorRepository extends BaseRepository {
  /**
   * 插入或更新向量文档
   */
  async upsert(data: VectorDocumentFormData): Promise<VectorDocumentEntity> {
    const now = this.now();

    // 尝试查找现有记录
    const existing = await this.db
      .select()
      .from(vectorDocuments)
      .where(sql`${vectorDocuments.filename} = ${data.filename} AND ${vectorDocuments.chunkId} = ${data.chunkId}`)
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
        .where(sql`${vectorDocuments.filename} = ${data.filename} AND ${vectorDocuments.chunkId} = ${data.chunkId}`);

      const result = await this.db
        .select()
        .from(vectorDocuments)
        .where(sql`${vectorDocuments.filename} = ${data.filename} AND ${vectorDocuments.chunkId} = ${data.chunkId}`)
        .limit(1);

      return result[0] as VectorDocumentEntity;
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

      return result[0] as VectorDocumentEntity;
    }
  }

  /**
   * 根据文件名获取向量文档
   */
  async findByFilename(filename: string): Promise<VectorDocumentEntity[]> {
    const result = await this.db
      .select()
      .from(vectorDocuments)
      .where(eq(vectorDocuments.filename, filename))
      .orderBy(vectorDocuments.chunkId);

    return result as VectorDocumentEntity[];
  }

  /**
   * 根据文件名删除向量文档
   */
  async deleteByFilename(filename: string): Promise<{ deletedCount: number }> {
    const result = await this.db.delete(vectorDocuments).where(eq(vectorDocuments.filename, filename));

    return { deletedCount: result.changes || 0 };
  }

  /**
   * 获取相似文档（Todo:简化版，实际使用时需要向量相似度计算）
   */
  async getSimilar(_: string, limit: number = 10): Promise<VectorDocumentEntity[]> {
    // 这里是简化版本，实际应该使用向量相似度计算
    // 现在只返回最近更新的文档
    const result = await this.db.select().from(vectorDocuments).orderBy(vectorDocuments.updatedAt).limit(limit);

    return result as VectorDocumentEntity[];
  }

  /**
   * 清空所有向量文档
   */
  async clear(): Promise<{ deletedCount: number }> {
    const result = await this.db.delete(vectorDocuments);
    return { deletedCount: result.changes || 0 };
  }

  /**
   * 初始化向量数据库（可以用于创建索引等）
   */
  async init(): Promise<{ success: boolean }> {
    // 这里可以添加向量数据库初始化逻辑
    // 比如创建向量索引等
    return { success: true };
  }
}
