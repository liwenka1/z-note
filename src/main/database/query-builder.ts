import { eq, and, like, or, sql, type SQL } from "drizzle-orm";
import { notes, folders } from "./schema";

/**
 * 搜索字段类型
 */
type SearchableField = Parameters<typeof like>[0];

/**
 * 数据库字段类型
 */
type DatabaseField = Parameters<typeof eq>[0];

/**
 * 构建查询条件的工具函数
 */
export class QueryConditions {
  private conditions: SQL<unknown>[] = [];

  /**
   * 添加条件
   */
  add(condition: SQL<unknown>) {
    this.conditions.push(condition);
    return this;
  }

  /**
   * 添加软删除过滤
   */
  withoutDeleted(table: { isDeleted: DatabaseField }) {
    this.conditions.push(eq(table.isDeleted, false));
    return this;
  }

  /**
   * 添加搜索条件
   */
  withSearch(query: string, fields: SearchableField[]) {
    if (query.trim() && fields.length > 0) {
      const searchConditions = fields.map((field) => like(field, `%${query}%`)).filter(Boolean);

      if (searchConditions.length > 0) {
        this.conditions.push(or(...searchConditions)!);
      }
    }
    return this;
  }

  /**
   * 添加相等条件
   */
  whereEquals(field: DatabaseField, value: unknown) {
    if (value !== undefined && value !== null) {
      this.conditions.push(eq(field, value));
    }
    return this;
  }

  /**
   * 获取最终的where条件
   */
  build(): SQL<unknown> | undefined {
    if (this.conditions.length === 0) return undefined;
    if (this.conditions.length === 1) return this.conditions[0];
    return and(...this.conditions);
  }

  /**
   * 重置条件
   */
  reset() {
    this.conditions = [];
    return this;
  }
}

/**
 * 笔记查询助手
 */
export class NotesQueryHelper {
  static buildListQuery(
    params: {
      includeDeleted?: boolean;
      folderId?: string;
      search?: string;
    } = {}
  ) {
    const conditions = new QueryConditions();

    // 软删除过滤
    if (!params.includeDeleted) {
      conditions.withoutDeleted(notes);
    }

    // 文件夹过滤
    if (params.folderId) {
      conditions.whereEquals(notes.folderId, params.folderId);
    }

    // 搜索过滤
    if (params.search) {
      conditions.withSearch(params.search, [notes.title, notes.content]);
    }

    return conditions.build();
  }

  static buildDetailQuery(id: string) {
    return and(eq(notes.id, id), eq(notes.isDeleted, false));
  }
}

/**
 * 文件夹查询助手
 */
export class FoldersQueryHelper {
  static buildListQuery(params: { includeDeleted?: boolean } = {}) {
    const conditions = new QueryConditions();

    if (!params.includeDeleted) {
      conditions.withoutDeleted(folders);
    }

    return conditions.build();
  }

  static buildDetailQuery(id: string) {
    return and(eq(folders.id, id), eq(folders.isDeleted, false));
  }

  static buildChildrenQuery(parentId?: string) {
    const conditions = new QueryConditions().withoutDeleted(folders);

    if (parentId) {
      conditions.whereEquals(folders.parentId, parentId);
    } else {
      conditions.add(sql`${folders.parentId} IS NULL`);
    }

    return conditions.build();
  }
}
