import { eq, sql } from "drizzle-orm";
import { marks } from "../database/schema";
import { BaseRepository } from "./base-repository";

export interface MarkFormData {
  tagId: number;
  type: "scan" | "text" | "image" | "link" | "file";
  content?: string;
  url?: string;
  desc?: string;
}

export interface MarkEntity {
  id: number;
  tagId: number;
  type: "scan" | "text" | "image" | "link" | "file";
  content: string | null;
  url: string | null;
  desc: string | null;
  deleted: number;
  createdAt: number;
}

/**
 * 标记Repository - 简化版
 */
export class MarksRepository extends BaseRepository {
  /**
   * 根据标签获取标记（不包括已删除的）
   */
  async findByTag(tagId: number): Promise<MarkEntity[]> {
    const result = await this.db
      .select({
        id: marks.id,
        tagId: marks.tagId,
        type: marks.type,
        content: marks.content,
        url: marks.url,
        desc: marks.desc,
        deleted: marks.deleted,
        createdAt: marks.createdAt
      })
      .from(marks)
      .where(sql`${marks.tagId} = ${tagId} AND ${marks.deleted} = 0`)
      .orderBy(marks.createdAt);

    return result as MarkEntity[];
  }

  /**
   * 获取所有标记（包括回收站）
   */
  async findAll(includeDeleted: boolean = false): Promise<MarkEntity[]> {
    const result = await this.db
      .select({
        id: marks.id,
        tagId: marks.tagId,
        type: marks.type,
        content: marks.content,
        url: marks.url,
        desc: marks.desc,
        deleted: marks.deleted,
        createdAt: marks.createdAt
      })
      .from(marks)
      .where(includeDeleted ? undefined : eq(marks.deleted, 0))
      .orderBy(marks.createdAt);

    return result as MarkEntity[];
  }

  /**
   * 创建标记
   */
  async create(data: MarkFormData): Promise<MarkEntity> {
    const now = this.now();

    const result = await this.db
      .insert(marks)
      .values({
        tagId: data.tagId,
        type: data.type,
        content: data.content || null,
        url: data.url || null,
        desc: data.desc || null,
        deleted: 0,
        createdAt: now
      })
      .returning();

    return result[0] as MarkEntity;
  }

  /**
   * 更新标记
   */
  async update(id: number, data: Partial<MarkFormData>): Promise<MarkEntity> {
    await this.checkExists(marks, marks.id, id, "标记不存在");

    const updateData: Record<string, unknown> = {};
    if (data.tagId !== undefined) updateData.tagId = data.tagId;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.desc !== undefined) updateData.desc = data.desc;

    await this.db.update(marks).set(updateData).where(eq(marks.id, id));

    const result = await this.db.select().from(marks).where(eq(marks.id, id)).limit(1);

    return result[0] as MarkEntity;
  }

  /**
   * 软删除标记（移至回收站）
   */
  async delete(id: number): Promise<{ id: number }> {
    await this.checkExists(marks, marks.id, id, "标记不存在");

    await this.db.update(marks).set({ deleted: 1 }).where(eq(marks.id, id));

    return { id };
  }

  /**
   * 恢复已删除的标记
   */
  async restore(id: number): Promise<MarkEntity> {
    await this.checkExists(marks, marks.id, id, "标记不存在");

    await this.db.update(marks).set({ deleted: 0 }).where(eq(marks.id, id));

    const result = await this.db.select().from(marks).where(eq(marks.id, id)).limit(1);

    return result[0] as MarkEntity;
  }

  /**
   * 永久删除标记
   */
  async deleteForever(id: number): Promise<{ id: number }> {
    await this.checkExists(marks, marks.id, id, "标记不存在");
    await this.db.delete(marks).where(eq(marks.id, id));
    return { id };
  }

  /**
   * 清空回收站
   */
  async clearTrash(): Promise<{ deletedCount: number }> {
    const result = await this.db.delete(marks).where(eq(marks.deleted, 1));

    return { deletedCount: result.changes || 0 };
  }
}
