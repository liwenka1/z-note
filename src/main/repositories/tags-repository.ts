import { eq } from "drizzle-orm";
import { tags } from "../database/schema";
import { BaseRepository } from "./base-repository";

export interface TagFormData {
  name: string;
}

export interface TagEntity {
  id: number;
  name: string;
  isLocked: boolean;
  isPin: boolean;
}

/**
 * 标签数据访问层 - 简化版
 */
export class TagsRepository extends BaseRepository {
  /**
   * 获取所有标签
   */
  async findAll(): Promise<TagEntity[]> {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        isLocked: tags.isLocked,
        isPin: tags.isPin
      })
      .from(tags)
      .orderBy(tags.isPin, tags.name);

    return result;
  }

  /**
   * 创建标签
   */
  async create(data: TagFormData): Promise<TagEntity> {
    const result = await this.db
      .insert(tags)
      .values({
        name: data.name,
        isLocked: false,
        isPin: false
      })
      .returning();

    return result[0] as TagEntity;
  }

  /**
   * 更新标签
   */
  async update(id: number, data: Partial<TagFormData>): Promise<TagEntity> {
    await this.checkExists(tags, tags.id, id, "标签不存在");

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;

    await this.db.update(tags).set(updateData).where(eq(tags.id, id));

    const result = await this.db.select().from(tags).where(eq(tags.id, id)).limit(1);

    return result[0] as TagEntity;
  }

  /**
   * 删除标签
   */
  async delete(id: number): Promise<{ id: number }> {
    await this.checkExists(tags, tags.id, id, "标签不存在");
    await this.db.delete(tags).where(eq(tags.id, id));
    return { id };
  }

  /**
   * 删除所有标签（除了默认标签）
   */
  async deleteAll(): Promise<{ deletedCount: number }> {
    // 只删除非锁定的标签
    const result = await this.db.delete(tags).where(eq(tags.isLocked, false));

    return { deletedCount: result.changes || 0 };
  }
}
