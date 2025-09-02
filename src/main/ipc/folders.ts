import { eq, and, sql } from "drizzle-orm";
import { getDatabase } from "../database/db";
import { folders, notes } from "../database/schema";
import { generateId } from "../utils/helpers";
import { registerHandler } from "./registry";
import type { FolderFormData } from "../../renderer/src/types/entities";

// 获取文件夹列表（包含层级关系）
async function getFolders() {
  const db = getDatabase();

  const result = await db
    .select({
      id: folders.id,
      name: folders.name,
      parentId: folders.parentId,
      color: folders.color,
      icon: folders.icon,
      isDeleted: folders.isDeleted,
      sortOrder: folders.sortOrder,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
      noteCount: sql<number>`COUNT(${notes.id})`.as("noteCount")
    })
    .from(folders)
    .leftJoin(notes, and(eq(folders.id, notes.folderId), eq(notes.isDeleted, false)))
    .where(eq(folders.isDeleted, false))
    .groupBy(folders.id)
    .orderBy(folders.sortOrder, folders.name);

  return result;
}

// 获取单个文件夹
async function getFolder(id: string) {
  const db = getDatabase();

  const result = await db
    .select()
    .from(folders)
    .where(and(eq(folders.id, id), eq(folders.isDeleted, false)))
    .limit(1);

  if (result.length === 0) {
    throw new Error("文件夹不存在");
  }

  return result[0];
}

// 创建文件夹
async function createFolder(data: FolderFormData) {
  const db = getDatabase();
  const now = new Date();
  const id = generateId();

  // 检查父文件夹是否存在
  if (data.parentId) {
    const parent = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, data.parentId), eq(folders.isDeleted, false)))
      .limit(1);

    if (parent.length === 0) {
      throw new Error("父文件夹不存在");
    }
  }

  // 获取同级文件夹的最大排序值
  const maxSortResult = await db
    .select({ maxSort: sql<number>`MAX(${folders.sortOrder})` })
    .from(folders)
    .where(
      and(
        eq(folders.isDeleted, false),
        data.parentId ? eq(folders.parentId, data.parentId) : sql`${folders.parentId} IS NULL`
      )
    );

  const nextSortOrder = (maxSortResult[0]?.maxSort || 0) + 1;

  await db.insert(folders).values({
    id,
    name: data.name,
    parentId: data.parentId || null,
    color: data.color || "#64748b",
    icon: data.icon || "📁",
    isDeleted: false,
    sortOrder: nextSortOrder,
    createdAt: now,
    updatedAt: now
  });

  return await getFolder(id);
}

// 更新文件夹
async function updateFolder(id: string, data: Partial<FolderFormData>) {
  const db = getDatabase();
  const now = new Date();

  // 检查文件夹是否存在
  const existing = await getFolder(id);

  // 如果要移动到新的父文件夹，检查父文件夹是否存在
  if (data.parentId && data.parentId !== existing.parentId) {
    const parent = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, data.parentId), eq(folders.isDeleted, false)))
      .limit(1);

    if (parent.length === 0) {
      throw new Error("目标父文件夹不存在");
    }

    // 检查是否会造成循环引用
    if (await wouldCreateCycle(id, data.parentId)) {
      throw new Error("不能移动到子文件夹中，这会造成循环引用");
    }
  }

  const updateData: Partial<typeof folders.$inferInsert> = {
    updatedAt: now
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.parentId !== undefined) updateData.parentId = data.parentId;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.icon !== undefined) updateData.icon = data.icon;

  await db.update(folders).set(updateData).where(eq(folders.id, id));

  return await getFolder(id);
}

// 检查是否会造成循环引用
async function wouldCreateCycle(folderId: string, newParentId: string): Promise<boolean> {
  const db = getDatabase();

  let currentId = newParentId;
  const visited = new Set<string>();

  while (currentId) {
    if (visited.has(currentId)) {
      return true; // 检测到循环
    }

    if (currentId === folderId) {
      return true; // 会造成循环引用
    }

    visited.add(currentId);

    const parent = await db
      .select({ parentId: folders.parentId })
      .from(folders)
      .where(eq(folders.id, currentId))
      .limit(1);

    currentId = parent[0]?.parentId;
  }

  return false;
}

// 删除文件夹（软删除）
async function deleteFolder(id: string) {
  const db = getDatabase();

  // 检查是否有子文件夹
  const children = await db
    .select()
    .from(folders)
    .where(and(eq(folders.parentId, id), eq(folders.isDeleted, false)))
    .limit(1);

  if (children.length > 0) {
    throw new Error("不能删除包含子文件夹的文件夹，请先删除或移动子文件夹");
  }

  // 检查是否有笔记
  const folderNotes = await db
    .select()
    .from(notes)
    .where(and(eq(notes.folderId, id), eq(notes.isDeleted, false)))
    .limit(1);

  if (folderNotes.length > 0) {
    throw new Error("不能删除包含笔记的文件夹，请先删除或移动笔记");
  }

  await db
    .update(folders)
    .set({
      isDeleted: true,
      updatedAt: new Date()
    })
    .where(eq(folders.id, id));

  return { id };
}

// 恢复文件夹（从垃圾箱中恢复）
async function restoreFolder(id: string) {
  const db = getDatabase();

  const folder = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
  if (folder.length === 0) {
    throw new Error("文件夹不存在");
  }

  if (!folder[0].isDeleted) {
    throw new Error("文件夹未被删除，无需恢复");
  }

  // 检查父文件夹是否仍然存在且未被删除
  if (folder[0].parentId) {
    const parent = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folder[0].parentId), eq(folders.isDeleted, false)))
      .limit(1);

    if (parent.length === 0) {
      // 如果父文件夹不存在或已删除，将文件夹移动到根目录
      await db
        .update(folders)
        .set({
          isDeleted: false,
          parentId: null,
          updatedAt: new Date()
        })
        .where(eq(folders.id, id));
    } else {
      await db
        .update(folders)
        .set({
          isDeleted: false,
          updatedAt: new Date()
        })
        .where(eq(folders.id, id));
    }
  } else {
    await db
      .update(folders)
      .set({
        isDeleted: false,
        updatedAt: new Date()
      })
      .where(eq(folders.id, id));
  }

  return await getFolder(id);
}

// 永久删除文件夹
async function permanentDeleteFolder(id: string) {
  const db = getDatabase();

  const folder = await db.select().from(folders).where(eq(folders.id, id)).limit(1);
  if (folder.length === 0) {
    throw new Error("文件夹不存在");
  }

  // 检查是否有子文件夹（包括已删除的）
  const children = await db.select().from(folders).where(eq(folders.parentId, id)).limit(1);

  if (children.length > 0) {
    throw new Error("不能永久删除包含子文件夹的文件夹，请先永久删除子文件夹");
  }

  // 检查是否有笔记（包括已删除的）
  const folderNotes = await db.select().from(notes).where(eq(notes.folderId, id)).limit(1);

  if (folderNotes.length > 0) {
    throw new Error("不能永久删除包含笔记的文件夹，请先永久删除或移动笔记");
  }

  // 永久删除文件夹
  await db.delete(folders).where(eq(folders.id, id));

  return { id };
}

// 注册IPC处理器
export function registerFoldersHandlers() {
  registerHandler("folders:list", getFolders);

  registerHandler("folders:get", getFolder);

  registerHandler("folders:create", createFolder);

  registerHandler("folders:update", updateFolder);

  registerHandler("folders:delete", deleteFolder);

  registerHandler("folders:restore", restoreFolder);

  registerHandler("folders:permanent-delete", permanentDeleteFolder);
}
