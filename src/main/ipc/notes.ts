import { ipcMain } from "electron";
import { eq, and, like, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { getDatabase } from "../database/db";
import { notes, noteTags } from "../database/schema";
import { generateId, withErrorHandling } from "../utils/helpers";
import type { NoteFormData } from "../../renderer/src/types/entities";
import type { GetNotesRequest } from "../../renderer/src/types/api";

// 获取笔记列表
async function getNotes(params: GetNotesRequest = {}) {
  const db = getDatabase();

  // 构建查询条件
  const conditions: SQL<unknown>[] = [];

  // 根据是否包含已删除笔记筛选
  if (!params.includeDeleted) {
    conditions.push(eq(notes.isDeleted, false));
  }

  // 根据文件夹过滤
  if (params.folderId) {
    conditions.push(eq(notes.folderId, params.folderId));
  }

  // 搜索功能
  if (params.search) {
    const searchCondition = or(like(notes.title, `%${params.search}%`), like(notes.content, `%${params.search}%`));
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

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
    .where(conditions.length > 0 ? (conditions.length > 1 ? and(...conditions) : conditions[0]) : undefined)
    .groupBy(notes.id);

  const result = await query;

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
  ipcMain.handle(
    "notes:list",
    withErrorHandling((_event, params?: GetNotesRequest) => getNotes(params))
  );
  ipcMain.handle(
    "notes:get",
    withErrorHandling((_event, id: string) => getNote(id))
  );
  ipcMain.handle(
    "notes:create",
    withErrorHandling((_event, data: NoteFormData) => createNote(data))
  );
  ipcMain.handle(
    "notes:update",
    withErrorHandling((_event, id: string, data: Partial<NoteFormData>) => updateNote(id, data))
  );
  ipcMain.handle(
    "notes:delete",
    withErrorHandling((_event, id: string) => deleteNote(id))
  );
  ipcMain.handle(
    "notes:toggle-favorite",
    withErrorHandling((_event, id: string) => toggleFavorite(id))
  );
  ipcMain.handle(
    "notes:restore",
    withErrorHandling((_event, id: string) => restoreNote(id))
  );
  ipcMain.handle(
    "notes:permanent-delete",
    withErrorHandling((_event, id: string) => permanentDeleteNote(id))
  );

  console.log("✅ 笔记 IPC 处理器注册完成");
}
