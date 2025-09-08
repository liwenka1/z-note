import { eq } from "drizzle-orm";
import { notes } from "../database/schema";
import { BaseRepository } from "./base-repository";

export interface NoteFormData {
  tagId: number;
  content?: string;
  locale: string;
  count: string;
}

export interface NoteEntity {
  id: number;
  tagId: number;
  content: string | null;
  locale: string;
  count: string;
  createdAt: number;
}

/**
 * 笔记Repository - 简化版
 * 只保留必要的数据访问操作
 */
export class NotesRepository extends BaseRepository {
  /**
   * 根据标签获取笔记列表
   */
  async findByTag(tagId: number): Promise<NoteEntity[]> {
    const result = await this.db
      .select({
        id: notes.id,
        tagId: notes.tagId,
        content: notes.content,
        locale: notes.locale,
        count: notes.count,
        createdAt: notes.createdAt
      })
      .from(notes)
      .where(eq(notes.tagId, tagId))
      .orderBy(notes.createdAt);

    return result;
  }

  /**
   * 根据ID查找笔记
   */
  async findById(id: number): Promise<NoteEntity | null> {
    const result = await this.db
      .select({
        id: notes.id,
        tagId: notes.tagId,
        content: notes.content,
        locale: notes.locale,
        count: notes.count,
        createdAt: notes.createdAt
      })
      .from(notes)
      .where(this.withId(notes.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * 创建笔记
   */
  async create(data: NoteFormData): Promise<NoteEntity> {
    const now = this.now();

    const result = await this.db
      .insert(notes)
      .values({
        tagId: data.tagId,
        content: data.content || null,
        locale: data.locale,
        count: data.count,
        createdAt: now
      })
      .returning();

    return (await this.findById(result[0].id)) as NoteEntity;
  }

  /**
   * 删除笔记
   */
  async delete(id: number): Promise<{ id: number }> {
    await this.checkExists(notes, notes.id, id, "笔记不存在");
    await this.db.delete(notes).where(eq(notes.id, id));
    return { id };
  }
}
