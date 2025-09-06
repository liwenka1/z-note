import { eq, and, like, or, type SQL } from "drizzle-orm";
import { notes, tags, chats, marks } from "./schema";

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
   * 添加软删除过滤（适用于 marks 表）
   */
  withoutDeleted(table: { deleted: DatabaseField }) {
    this.conditions.push(eq(table.deleted, 0));
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
      tagId?: number;
      locale?: string;
      search?: string;
    } = {}
  ) {
    const conditions = new QueryConditions();

    // 标签过滤
    if (params.tagId) {
      conditions.whereEquals(notes.tagId, params.tagId);
    }

    // 语言过滤
    if (params.locale) {
      conditions.whereEquals(notes.locale, params.locale);
    }

    // 搜索过滤
    if (params.search) {
      conditions.withSearch(params.search, [notes.content]);
    }

    return conditions.build();
  }

  static buildDetailQuery(id: number) {
    return eq(notes.id, id);
  }
}

/**
 * 标签查询助手
 */
export class TagsQueryHelper {
  static buildListQuery(params: { search?: string } = {}) {
    const conditions = new QueryConditions();

    // 搜索过滤
    if (params.search) {
      conditions.withSearch(params.search, [tags.name]);
    }

    return conditions.build();
  }

  static buildDetailQuery(id: number) {
    return eq(tags.id, id);
  }
}

/**
 * 聊天查询助手
 */
export class ChatsQueryHelper {
  static buildListQuery(
    params: {
      tagId?: number;
      role?: "system" | "user";
      type?: "chat" | "note" | "clipboard" | "clear";
      inserted?: boolean;
      search?: string;
    } = {}
  ) {
    const conditions = new QueryConditions();

    // 标签过滤
    if (params.tagId) {
      conditions.whereEquals(chats.tagId, params.tagId);
    }

    // 角色过滤
    if (params.role) {
      conditions.whereEquals(chats.role, params.role);
    }

    // 类型过滤
    if (params.type) {
      conditions.whereEquals(chats.type, params.type);
    }

    // 插入状态过滤
    if (params.inserted !== undefined) {
      conditions.whereEquals(chats.inserted, params.inserted);
    }

    // 搜索过滤
    if (params.search) {
      conditions.withSearch(params.search, [chats.content]);
    }

    return conditions.build();
  }

  static buildDetailQuery(id: number) {
    return eq(chats.id, id);
  }
}

/**
 * 标记查询助手
 */
export class MarksQueryHelper {
  static buildListQuery(
    params: {
      tagId?: number;
      type?: "scan" | "text" | "image" | "link" | "file";
      includeDeleted?: boolean;
      search?: string;
    } = {}
  ) {
    const conditions = new QueryConditions();

    // 软删除过滤
    if (!params.includeDeleted) {
      conditions.withoutDeleted(marks);
    }

    // 标签过滤
    if (params.tagId) {
      conditions.whereEquals(marks.tagId, params.tagId);
    }

    // 类型过滤
    if (params.type) {
      conditions.whereEquals(marks.type, params.type);
    }

    // 搜索过滤
    if (params.search) {
      conditions.withSearch(params.search, [marks.content, marks.desc]);
    }

    return conditions.build();
  }

  static buildDetailQuery(id: number) {
    return and(eq(marks.id, id), eq(marks.deleted, 0));
  }
}
