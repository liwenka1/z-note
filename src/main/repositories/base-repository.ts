import { eq, and, type SQL } from "drizzle-orm";
import { getDatabase } from "../database/db";
import type { Column, Table } from "drizzle-orm";

/**
 * 基础Repository抽象类
 * 提供通用的数据库操作方法
 */
export abstract class BaseRepository {
  protected db = getDatabase();

  /**
   * 组合查询条件
   */
  protected combineConditions(...conditions: (SQL<unknown> | undefined)[]): SQL<unknown> | undefined {
    const validConditions = conditions.filter(Boolean) as SQL<unknown>[];

    if (validConditions.length === 0) return undefined;
    if (validConditions.length === 1) return validConditions[0];

    return and(...validConditions);
  }

  /**
   * 创建软删除条件
   */
  protected withoutDeleted(deletedField: Column): SQL<unknown> {
    return eq(deletedField, false);
  }

  /**
   * 创建ID匹配条件
   */
  protected withId(idField: Column, id: string): SQL<unknown> {
    return eq(idField, id);
  }

  /**
   * 检查记录是否存在
   */
  protected async checkExists(table: Table, idField: Column, id: string, errorMessage: string): Promise<void> {
    const result = await this.db.select().from(table).where(eq(idField, id)).limit(1);

    if (result.length === 0) {
      throw new Error(errorMessage);
    }
  }

  /**
   * 生成当前时间
   */
  protected now(): Date {
    return new Date();
  }
}
