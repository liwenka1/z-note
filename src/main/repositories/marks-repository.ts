import { eq, and } from "drizzle-orm";
import { marks } from "../database/schema";
import { BaseRepository } from "./base-repository";
import type { Mark, MarkFormData } from "@shared/types";

/**
 * 标记Repository - 简化版
 */
export class MarksRepository extends BaseRepository {
  /**
   * 根据标签获取标记（不包括已删除的）
   */
  async findByTag(tagId: number): Promise<Mark[]> {
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
      .where(and(eq(marks.tagId, tagId), eq(marks.deleted, 0)))
      .orderBy(marks.createdAt);

    // 将数据库的 null 转换为 undefined，符合共享类型定义
    return result.map((mark) => ({
      ...mark,
      content: mark.content ?? undefined,
      url: mark.url ?? undefined,
      desc: mark.desc ?? undefined,
      createdAt: mark.createdAt ?? undefined,
      type: mark.type as Mark["type"]
    }));
  }

  /**
   * 获取所有标记（包括回收站）
   */
  async findAll(includeDeleted: boolean = false): Promise<Mark[]> {
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

    // 将数据库的 null 转换为 undefined，符合共享类型定义
    return result.map((mark) => ({
      ...mark,
      content: mark.content ?? undefined,
      url: mark.url ?? undefined,
      desc: mark.desc ?? undefined,
      createdAt: mark.createdAt ?? undefined,
      type: mark.type as Mark["type"]
    }));
  }

  /**
   * 创建标记
   */
  async create(data: MarkFormData): Promise<Mark> {
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

    const mark = result[0];
    return {
      ...mark,
      content: mark.content ?? undefined,
      url: mark.url ?? undefined,
      desc: mark.desc ?? undefined,
      createdAt: mark.createdAt ?? undefined,
      type: mark.type as Mark["type"]
    };
  }

  /**
   * 更新标记
   */
  async update(id: number, data: Partial<MarkFormData>): Promise<Mark> {
    await this.checkExists(marks, marks.id, id, "标记不存在");

    const updateData: Record<string, unknown> = {};
    if (data.tagId !== undefined) updateData.tagId = data.tagId;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.desc !== undefined) updateData.desc = data.desc;

    await this.db.update(marks).set(updateData).where(eq(marks.id, id));

    const result = await this.db.select().from(marks).where(eq(marks.id, id)).limit(1);

    const mark = result[0];
    return {
      ...mark,
      content: mark.content ?? undefined,
      url: mark.url ?? undefined,
      desc: mark.desc ?? undefined,
      createdAt: mark.createdAt ?? undefined,
      type: mark.type as Mark["type"]
    };
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
  async restore(id: number): Promise<Mark> {
    await this.checkExists(marks, marks.id, id, "标记不存在");

    await this.db.update(marks).set({ deleted: 0 }).where(eq(marks.id, id));

    const result = await this.db.select().from(marks).where(eq(marks.id, id)).limit(1);

    const mark = result[0];
    return {
      ...mark,
      content: mark.content ?? undefined,
      url: mark.url ?? undefined,
      desc: mark.desc ?? undefined,
      createdAt: mark.createdAt ?? undefined,
      type: mark.type as Mark["type"]
    };
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
