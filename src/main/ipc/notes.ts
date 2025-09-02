import { eq, and, sql } from "drizzle-orm";
import { getDatabase } from "../database/db";
import { notes, noteTags } from "../database/schema";
import { generateId } from "../utils/helpers";
import { registerHandler } from "./registry";
import { NotesQueryHelper } from "../database/query-builder";
import type { NoteFormData } from "../../renderer/src/types/entities";
import type { GetNotesRequest } from "../../renderer/src/types/api";

// 获取笔记列表
async function getNotes(params: GetNotesRequest = {}) {
  const db = getDatabase();

  // 使用查询构建器构建条件
  const whereCondition = NotesQueryHelper.buildListQuery(params);

  const query = db
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

  // 应用条件
  const result = whereCondition ? await query.where(whereCondition) : await query;

  // 解析 tagIds JSON 字符串为数组
  const notesWithTags = result.map((note) => ({
    ...note,
    tagIds: typeof note.tagIds === "string" ? JSON.parse(note.tagIds) : note.tagIds || []
  }));

  return notesWithTags;
}

// 获取单个笔记
async function getNote(id: string) {
  const db = getDatabase();

  const result = await db
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
    .where(and(eq(notes.id, id), eq(notes.isDeleted, false)))
    .groupBy(notes.id);

  if (result.length === 0) {
    throw new Error("笔记不存在");
  }

  const note = result[0];
  return {
    ...note,
    tagIds: typeof note.tagIds === "string" ? JSON.parse(note.tagIds) : note.tagIds || []
  };
}

// 创建笔记
async function createNote(data: NoteFormData) {
  const db = getDatabase();
  const now = new Date();
  const id = generateId();

  // 创建笔记
  await db.insert(notes).values({
    id,
    title: data.title,
    content: data.content,
    folderId: data.folderId || null,
    isFavorite: false,
    isDeleted: false,
    createdAt: now,
    updatedAt: now
  });

  // 添加标签关联
  if (data.tagIds && data.tagIds.length > 0) {
    const tagRelations = data.tagIds.map((tagId) => ({
      noteId: id,
      tagId
    }));
    await db.insert(noteTags).values(tagRelations);
  }

  // 返回创建的笔记
  return await getNote(id);
}

// 更新笔记
async function updateNote(id: string, data: Partial<NoteFormData>) {
  const db = getDatabase();
  const now = new Date();

  // 更新笔记基本信息
  const updateData: Partial<typeof notes.$inferInsert> = {
    updatedAt: now
  };

  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.folderId !== undefined) updateData.folderId = data.folderId;

  await db.update(notes).set(updateData).where(eq(notes.id, id));

  // 更新标签关联
  if (data.tagIds !== undefined) {
    // 删除现有关联
    await db.delete(noteTags).where(eq(noteTags.noteId, id));

    // 添加新关联
    if (data.tagIds.length > 0) {
      const tagRelations = data.tagIds.map((tagId) => ({
        noteId: id,
        tagId
      }));
      await db.insert(noteTags).values(tagRelations);
    }
  }

  // 返回更新后的笔记
  return await getNote(id);
}

// 删除笔记（软删除）
async function deleteNote(id: string) {
  const db = getDatabase();

  await db
    .update(notes)
    .set({
      isDeleted: true,
      updatedAt: new Date()
    })
    .where(eq(notes.id, id));

  return { id };
}

// 切换收藏状态
async function toggleFavorite(id: string) {
  const db = getDatabase();

  const note = await db.select({ isFavorite: notes.isFavorite }).from(notes).where(eq(notes.id, id)).limit(1);

  if (note.length === 0) {
    throw new Error("笔记不存在");
  }

  const newFavoriteStatus = !note[0].isFavorite;

  await db
    .update(notes)
    .set({
      isFavorite: newFavoriteStatus,
      updatedAt: new Date()
    })
    .where(eq(notes.id, id));

  return await getNote(id);
}

// 恢复笔记（从垃圾箱中恢复）
async function restoreNote(id: string) {
  const db = getDatabase();

  const note = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
  if (note.length === 0) {
    throw new Error("笔记不存在");
  }

  if (!note[0].isDeleted) {
    throw new Error("笔记未被删除，无需恢复");
  }

  await db
    .update(notes)
    .set({
      isDeleted: false,
      updatedAt: new Date()
    })
    .where(eq(notes.id, id));

  return await getNote(id);
}

// 永久删除笔记
async function permanentDeleteNote(id: string) {
  const db = getDatabase();

  const note = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
  if (note.length === 0) {
    throw new Error("笔记不存在");
  }

  // 删除笔记和标签的关联
  await db.delete(noteTags).where(eq(noteTags.noteId, id));

  // 删除笔记
  await db.delete(notes).where(eq(notes.id, id));

  return { id };
}

// 注册IPC处理器
export function registerNotesHandlers() {
  registerHandler("notes:list", (_event: unknown, params?: GetNotesRequest) => getNotes(params));

  registerHandler("notes:get", (_event: unknown, id: string) => getNote(id));

  registerHandler("notes:create", (_event: unknown, data: NoteFormData) => createNote(data));

  registerHandler("notes:update", (_event: unknown, id: string, data: Partial<NoteFormData>) => updateNote(id, data));

  registerHandler("notes:delete", (_event: unknown, id: string) => deleteNote(id));

  registerHandler("notes:toggle-favorite", (_event: unknown, id: string) => toggleFavorite(id));

  registerHandler("notes:restore", (_event: unknown, id: string) => restoreNote(id));

  registerHandler("notes:permanent-delete", (_event: unknown, id: string) => permanentDeleteNote(id));
}
