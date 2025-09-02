import { eq, and, sql } from "drizzle-orm";
import { notes, noteTags } from "../database/schema";
import { BaseRepository } from "./base-repository";
import { generateId } from "../utils/helpers";
import { NotesQueryHelper } from "../database/query-builder";
import type { NoteFormData } from "../../renderer/src/types/entities";
import type { GetNotesRequest } from "../../renderer/src/types/api";

export interface NoteEntity {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tagIds: string[];
}

export interface NoteCreateData extends NoteFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isDeleted: boolean;
}

export interface NoteUpdateData extends Partial<NoteFormData> {
  updatedAt: Date;
}

/**
 * 笔记Repository
 * 处理笔记相关的数据访问操作
 */
export class NotesRepository extends BaseRepository {
  /**
   * 获取笔记列表
   */
  async findMany(params: GetNotesRequest = {}): Promise<NoteEntity[]> {
    const whereCondition = NotesQueryHelper.buildListQuery(params);

    const query = this.db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        folderId: notes.folderId,
        isFavorite: notes.isFavorite,
        isDeleted: notes.isDeleted,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        tagIds: sql<string[]>`
          COALESCE(
            json_group_array(
              CASE WHEN ${noteTags.tagId} IS NOT NULL THEN ${noteTags.tagId} END
            ) FILTER (WHERE ${noteTags.tagId} IS NOT NULL),
            json_array()
          )
        `.as("tagIds")
      })
      .from(notes)
      .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
      .groupBy(notes.id);

    const result = whereCondition ? await query.where(whereCondition) : await query;

    // 解析 tagIds JSON 字符串为数组
    return result.map((note) => ({
      ...note,
      tagIds: typeof note.tagIds === "string" ? JSON.parse(note.tagIds) : note.tagIds || []
    }));
  }

  /**
   * 根据ID查找笔记
   */
  async findById(id: string, includeDeleted = false): Promise<NoteEntity | null> {
    const conditions = [eq(notes.id, id)];

    if (!includeDeleted) {
      conditions.push(this.withoutDeleted(notes.isDeleted));
    }

    const result = await this.db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        folderId: notes.folderId,
        isFavorite: notes.isFavorite,
        isDeleted: notes.isDeleted,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        tagIds: sql<string[]>`
          COALESCE(
            json_group_array(
              CASE WHEN ${noteTags.tagId} IS NOT NULL THEN ${noteTags.tagId} END
            ) FILTER (WHERE ${noteTags.tagId} IS NOT NULL),
            json_array()
          )
        `.as("tagIds")
      })
      .from(notes)
      .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
      .where(and(...conditions))
      .groupBy(notes.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const note = result[0];
    return {
      ...note,
      tagIds: typeof note.tagIds === "string" ? JSON.parse(note.tagIds) : note.tagIds || []
    };
  }

  /**
   * 根据ID查找笔记，如果不存在则抛出错误
   */
  async findByIdOrThrow(id: string, includeDeleted = false): Promise<NoteEntity> {
    const note = await this.findById(id, includeDeleted);

    if (!note) {
      throw new Error("笔记不存在");
    }

    return note;
  }

  /**
   * 创建笔记
   */
  async create(data: NoteFormData): Promise<NoteEntity> {
    const now = this.now();
    const id = generateId();

    // 创建笔记主记录
    const createData: NoteCreateData = {
      id,
      title: data.title,
      content: data.content,
      folderId: data.folderId ?? undefined,
      tagIds: data.tagIds || [],
      isFavorite: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now
    };

    await this.db.insert(notes).values({
      id: createData.id,
      title: createData.title,
      content: createData.content,
      folderId: createData.folderId,
      isFavorite: createData.isFavorite,
      isDeleted: createData.isDeleted,
      createdAt: createData.createdAt,
      updatedAt: createData.updatedAt
    });

    // 添加标签关联
    if (data.tagIds && data.tagIds.length > 0) {
      const tagRelations = data.tagIds.map((tagId) => ({
        noteId: id,
        tagId
      }));
      await this.db.insert(noteTags).values(tagRelations);
    }

    return this.findByIdOrThrow(id, true);
  }

  /**
   * 更新笔记
   */
  async update(id: string, data: Partial<NoteFormData>): Promise<NoteEntity> {
    // 检查笔记是否存在
    await this.findByIdOrThrow(id);

    const now = this.now();
    const updateData: Partial<NoteUpdateData> = {
      updatedAt: now
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.folderId !== undefined) updateData.folderId = data.folderId;

    // 更新笔记基本信息
    await this.db.update(notes).set(updateData).where(eq(notes.id, id));

    // 更新标签关联
    if (data.tagIds !== undefined) {
      // 删除现有关联
      await this.db.delete(noteTags).where(eq(noteTags.noteId, id));

      // 添加新关联
      if (data.tagIds.length > 0) {
        const tagRelations = data.tagIds.map((tagId) => ({
          noteId: id,
          tagId
        }));
        await this.db.insert(noteTags).values(tagRelations);
      }
    }

    return this.findByIdOrThrow(id, true);
  }

  /**
   * 软删除笔记
   */
  async softDelete(id: string): Promise<{ id: string }> {
    await this.checkExists(notes, notes.id, id, "笔记不存在");

    await this.db
      .update(notes)
      .set({
        isDeleted: true,
        updatedAt: this.now()
      })
      .where(eq(notes.id, id));

    return { id };
  }

  /**
   * 恢复笔记
   */
  async restore(id: string): Promise<NoteEntity> {
    const note = await this.findById(id, true);
    if (!note) {
      throw new Error("笔记不存在");
    }

    if (!note.isDeleted) {
      throw new Error("笔记未被删除，无需恢复");
    }

    await this.db
      .update(notes)
      .set({
        isDeleted: false,
        updatedAt: this.now()
      })
      .where(eq(notes.id, id));

    return this.findByIdOrThrow(id);
  }

  /**
   * 永久删除笔记
   */
  async permanentDelete(id: string): Promise<{ id: string }> {
    await this.checkExists(notes, notes.id, id, "笔记不存在");

    // 删除笔记和标签的关联
    await this.db.delete(noteTags).where(eq(noteTags.noteId, id));

    // 删除笔记
    await this.db.delete(notes).where(eq(notes.id, id));

    return { id };
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(id: string): Promise<NoteEntity> {
    const note = await this.findByIdOrThrow(id);

    const newFavoriteStatus = !note.isFavorite;

    await this.db
      .update(notes)
      .set({
        isFavorite: newFavoriteStatus,
        updatedAt: this.now()
      })
      .where(eq(notes.id, id));

    return this.findByIdOrThrow(id);
  }
}
