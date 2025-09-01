import { ipcMain } from "electron";
import { eq, sql } from "drizzle-orm";
import { getDatabase } from "../database/db";
import { tags, noteTags } from "../database/schema";
import { generateId, withErrorHandling } from "../utils/helpers";
import type { TagFormData } from "../../renderer/src/types/entities";

// 获取标签列表
async function getTags() {
  const db = getDatabase();

  const result = await db
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

// 获取单个标签
async function getTag(id: string) {
  const db = getDatabase();

  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

  if (result.length === 0) {
    throw new Error("标签不存在");
  }

  return result[0];
}

// 创建标签
async function createTag(data: TagFormData) {
  const db = getDatabase();
  const now = new Date();
  const id = generateId();

  // 检查标签名是否已存在
  const existing = await db.select().from(tags).where(eq(tags.name, data.name)).limit(1);

  if (existing.length > 0) {
    throw new Error("标签名已存在");
  }

  await db.insert(tags).values({
    id,
    name: data.name,
    color: data.color,
    createdAt: now,
    updatedAt: now
  });

  return await getTag(id);
}

// 更新标签
async function updateTag(id: string, data: Partial<TagFormData>) {
  const db = getDatabase();
  const now = new Date();

  // 检查标签是否存在
  await getTag(id);

  // 如果要更新名称，检查新名称是否已存在
  if (data.name) {
    const existing = await db.select().from(tags).where(eq(tags.name, data.name)).limit(1);

    if (existing.length > 0 && existing[0].id !== id) {
      throw new Error("标签名已存在");
    }
  }

  const updateData: Partial<typeof tags.$inferInsert> = {
    updatedAt: now
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.color !== undefined) updateData.color = data.color;

  await db.update(tags).set(updateData).where(eq(tags.id, id));

  return await getTag(id);
}

// 删除标签
async function deleteTag(id: string) {
  const db = getDatabase();

  // 检查是否有笔记在使用这个标签
  const usage = await db.select().from(noteTags).where(eq(noteTags.tagId, id)).limit(1);

  if (usage.length > 0) {
    throw new Error("不能删除正在使用的标签，请先从相关笔记中移除该标签");
  }

  await db.delete(tags).where(eq(tags.id, id));

  return { id };
}

// 获取标签的使用统计
async function getTagStats(id: string) {
  const db = getDatabase();

  const result = await db
    .select({
      tagId: tags.id,
      tagName: tags.name,
      noteCount: sql<number>`COUNT(${noteTags.noteId})`.as("noteCount")
    })
    .from(tags)
    .leftJoin(noteTags, eq(tags.id, noteTags.tagId))
    .where(eq(tags.id, id))
    .groupBy(tags.id);

  if (result.length === 0) {
    throw new Error("标签不存在");
  }

  return result[0];
}

// 注册IPC处理器
export function registerTagsHandlers() {
  ipcMain.handle(
    "tags:list",
    withErrorHandling(() => getTags())
  );
  ipcMain.handle(
    "tags:get",
    withErrorHandling((_event, id: string) => getTag(id))
  );
  ipcMain.handle(
    "tags:create",
    withErrorHandling((_event, data: TagFormData) => createTag(data))
  );
  ipcMain.handle(
    "tags:update",
    withErrorHandling((_event, id: string, data: Partial<TagFormData>) => updateTag(id, data))
  );
  ipcMain.handle(
    "tags:delete",
    withErrorHandling((_event, id: string) => deleteTag(id))
  );
  ipcMain.handle(
    "tags:stats",
    withErrorHandling((_event, id: string) => getTagStats(id))
  );

  console.log("✅ 标签 IPC 处理器注册完成");
}
