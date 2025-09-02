import { eq, and, sql } from "drizzle-orm";
import { folders, notes } from "../database/schema";
import { BaseRepository } from "./base-repository";
import type { FolderFormData } from "../../renderer/src/types/entities";

/**
 * 文件夹树节点类型
 */
export type FolderTreeNode = {
  id: string;
  name: string;
  parentId: string | null;
  color: string | null;
  icon: string | null;
  isDeleted: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  children: FolderTreeNode[];
};

/**
 * 文件夹数据访问层
 */
export class FoldersRepository extends BaseRepository {
  /**
   * 获取所有文件夹（包含层级关系）
   */
  async findMany() {
    const result = await this.db
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
      .groupBy(folders.id)
      .orderBy(folders.sortOrder);

    return result;
  }

  /**
   * 根据ID获取单个文件夹
   */
  async findById(id: string) {
    const result = await this.db
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
      .where(this.withId(folders.id, id))
      .groupBy(folders.id)
      .limit(1);

    return result[0] || null;
  }

  /**
   * 创建文件夹
   */
  async create(data: FolderFormData, id: string) {
    const now = this.now();

    await this.db.insert(folders).values({
      id,
      name: data.name,
      parentId: data.parentId || null,
      color: data.color || null,
      icon: data.icon || null,
      isDeleted: false,
      sortOrder: 0,
      createdAt: now,
      updatedAt: now
    });

    return await this.findById(id);
  }

  /**
   * 更新文件夹
   */
  async update(id: string, data: Partial<FolderFormData>) {
    const updateData: Record<string, unknown> = {
      updatedAt: this.now()
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.icon !== undefined) updateData.icon = data.icon;

    await this.db.update(folders).set(updateData).where(this.withId(folders.id, id));

    return await this.findById(id);
  }

  /**
   * 软删除文件夹
   */
  async softDelete(id: string) {
    await this.db
      .update(folders)
      .set({
        isDeleted: true,
        updatedAt: this.now()
      })
      .where(this.withId(folders.id, id));

    return { id };
  }

  /**
   * 恢复文件夹
   */
  async restore(id: string) {
    await this.db
      .update(folders)
      .set({
        isDeleted: false,
        updatedAt: this.now()
      })
      .where(this.withId(folders.id, id));

    return await this.findById(id);
  }

  /**
   * 永久删除文件夹
   */
  async permanentDelete(id: string) {
    await this.db.delete(folders).where(this.withId(folders.id, id));
    return { id };
  }

  /**
   * 检查是否有子文件夹
   */
  async hasSubfolders(id: string): Promise<boolean> {
    const result = await this.db
      .select({ id: folders.id })
      .from(folders)
      .where(this.combineConditions(eq(folders.parentId, id), this.withoutDeleted(folders.isDeleted)))
      .limit(1);

    return result.length > 0;
  }

  /**
   * 检查是否有笔记
   */
  async hasNotes(id: string): Promise<boolean> {
    const result = await this.db
      .select({ id: notes.id })
      .from(notes)
      .where(this.combineConditions(eq(notes.folderId, id), this.withoutDeleted(notes.isDeleted)))
      .limit(1);

    return result.length > 0;
  }

  /**
   * 检查父文件夹是否存在且未删除
   */
  async isValidParent(parentId: string): Promise<boolean> {
    const result = await this.db
      .select({ id: folders.id })
      .from(folders)
      .where(this.combineConditions(this.withId(folders.id, parentId), this.withoutDeleted(folders.isDeleted)))
      .limit(1);

    return result.length > 0;
  }

  /**
   * 检查是否会造成循环引用
   */
  async wouldCreateCycle(folderId: string, newParentId: string): Promise<boolean> {
    if (folderId === newParentId) {
      return true;
    }

    // 递归检查父级链
    let currentParentId: string | null = newParentId;
    const visited = new Set<string>();

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        // 检测到循环
        return true;
      }

      if (currentParentId === folderId) {
        return true;
      }

      visited.add(currentParentId);

      const parent = await this.db
        .select({ parentId: folders.parentId })
        .from(folders)
        .where(this.withId(folders.id, currentParentId))
        .limit(1);

      currentParentId = parent[0]?.parentId || null;
    }

    return false;
  }

  /**
   * 获取文件夹的所有祖先ID
   */
  async getAncestorIds(id: string): Promise<string[]> {
    const ancestors: string[] = [];
    let currentId: string | null = id;

    while (currentId) {
      const folder = await this.db
        .select({ parentId: folders.parentId })
        .from(folders)
        .where(this.withId(folders.id, currentId))
        .limit(1);

      const parentId = folder[0]?.parentId;
      if (parentId) {
        ancestors.push(parentId);
        currentId = parentId;
      } else {
        break;
      }
    }

    return ancestors;
  }

  /**
   * 获取文件夹树结构
   */
  async getFolderTree(): Promise<FolderTreeNode[]> {
    const allFolders = await this.db
      .select({
        id: folders.id,
        name: folders.name,
        parentId: folders.parentId,
        color: folders.color,
        icon: folders.icon,
        isDeleted: folders.isDeleted,
        sortOrder: folders.sortOrder,
        createdAt: folders.createdAt,
        updatedAt: folders.updatedAt
      })
      .from(folders)
      .where(this.withoutDeleted(folders.isDeleted))
      .orderBy(folders.sortOrder);

    // 构建树结构
    const folderMap = new Map<string, FolderTreeNode>();
    const rootFolders: FolderTreeNode[] = [];

    // 第一次遍历：创建节点映射
    allFolders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // 第二次遍历：构建父子关系
    allFolders.forEach((folder) => {
      const node = folderMap.get(folder.id);
      if (node) {
        if (folder.parentId) {
          const parent = folderMap.get(folder.parentId);
          if (parent) {
            parent.children.push(node);
          }
        } else {
          rootFolders.push(node);
        }
      }
    });

    return rootFolders;
  }
}
