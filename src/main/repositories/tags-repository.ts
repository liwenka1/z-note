import { eq, sql } from "drizzle-orm";
import { tags, noteTags } from "../database/schema";
import { BaseRepository } from "./base-repository";
import type { TagFormData } from "../../renderer/src/types/entities";

/**
 * 标签数据访问层
 */
export class TagsRepository extends BaseRepository {
  /**
   * 获取所有标签（包含使用次数）
   */
  async findMany() {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        noteCount: sql<number>`COUNT(${noteTags.noteId})`.as("noteCount")
      })
      .from(tags)
      .leftJoin(noteTags, eq(tags.id, noteTags.tagId))
      .groupBy(tags.id)
      .orderBy(tags.name);

    return result;
  }

  /**
   * 根据ID获取单个标签
   */
  async findById(id: string) {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        noteCount: sql<number>`COUNT(${noteTags.noteId})`.as("noteCount")
      })
      .from(tags)
      .leftJoin(noteTags, eq(tags.id, noteTags.tagId))
      .where(this.withId(tags.id, id))
      .groupBy(tags.id)
      .limit(1);

    return result[0] || null;
  }

  /**
   * 根据名称查找标签
   */
  async findByName(name: string) {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt
      })
      .from(tags)
      .where(eq(tags.name, name))
      .limit(1);

    return result[0] || null;
  }

  /**
   * 创建标签
   */
  async create(data: TagFormData, id: string) {
    const now = this.now();

    await this.db.insert(tags).values({
      id,
      name: data.name,
      color: data.color,
      createdAt: now,
      updatedAt: now
    });

    return await this.findById(id);
  }

  /**
   * 更新标签
   */
  async update(id: string, data: Partial<TagFormData>) {
    const updateData: Record<string, unknown> = {
      updatedAt: this.now()
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.color !== undefined) updateData.color = data.color;

    await this.db.update(tags).set(updateData).where(this.withId(tags.id, id));

    return await this.findById(id);
  }

  /**
   * 删除标签
   */
  async delete(id: string) {
    // 先删除标签关联
    await this.db.delete(noteTags).where(eq(noteTags.tagId, id));

    // 删除标签
    await this.db.delete(tags).where(this.withId(tags.id, id));

    return { id };
  }

  /**
   * 检查标签名称是否已存在（排除指定ID）
   */
  async isNameExists(name: string, excludeId?: string): Promise<boolean> {
    let query = this.db.select({ id: tags.id }).from(tags).where(eq(tags.name, name));

    if (excludeId) {
      query = this.db
        .select({ id: tags.id })
        .from(tags)
        .where(this.combineConditions(eq(tags.name, name), sql`${tags.id} != ${excludeId}`));
    }

    const result = await query.limit(1);
    return result.length > 0;
  }

  /**
   * 获取标签的笔记数量
   */
  async getNoteCount(id: string): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(noteTags)
      .where(eq(noteTags.tagId, id));

    return result[0]?.count || 0;
  }

  /**
   * 获取未使用的标签
   */
  async findUnused() {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        noteCount: sql<number>`0`.as("noteCount")
      })
      .from(tags)
      .leftJoin(noteTags, eq(tags.id, noteTags.tagId))
      .where(sql`${noteTags.tagId} IS NULL`)
      .orderBy(tags.name);

    return result;
  }

  /**
   * 获取最常用的标签
   */
  async findMostUsed(limit: number = 10) {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        noteCount: sql<number>`COUNT(${noteTags.noteId})`.as("noteCount")
      })
      .from(tags)
      .leftJoin(noteTags, eq(tags.id, noteTags.tagId))
      .groupBy(tags.id)
      .having(sql`COUNT(${noteTags.noteId}) > 0`)
      .orderBy(sql`COUNT(${noteTags.noteId}) DESC`)
      .limit(limit);

    return result;
  }

  /**
   * 搜索标签
   */
  async search(query: string) {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;

    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
        noteCount: sql<number>`COUNT(${noteTags.noteId})`.as("noteCount")
      })
      .from(tags)
      .leftJoin(noteTags, eq(tags.id, noteTags.tagId))
      .where(sql`${tags.name} LIKE ${searchTerm}`)
      .groupBy(tags.id)
      .orderBy(tags.name);

    return result;
  }
}
