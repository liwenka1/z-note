import { eq } from "drizzle-orm";
import { notes } from "../database/schema";
import { BaseRepository } from "./base-repository";
import type { Note, NoteFormData } from "@shared/types";

/**
 * 笔记Repository - 简化版
 * 只保留必要的数据访问操作
 */
export class NotesRepository extends BaseRepository {
  /**
   * 根据标签获取笔记列表
   */
  async findByTag(tagId: number): Promise<Note[]> {
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

    // 将数据库的 null 转换为 undefined，符合共享类型定义
    return result.map((note) => ({
      ...note,
      content: note.content ?? undefined
    }));
  }

  /**
   * 根据ID查找笔记
   */
  async findById(id: number): Promise<Note | null> {
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

    const note = result[0];
    if (!note) return null;

    // 将数据库的 null 转换为 undefined，符合共享类型定义
    return {
      ...note,
      content: note.content ?? undefined
    };
  }

  /**
   * 创建笔记
   */
  async create(data: NoteFormData): Promise<Note> {
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

    return (await this.findById(result[0].id)) as Note;
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
