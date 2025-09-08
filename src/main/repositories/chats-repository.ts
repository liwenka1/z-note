import { eq } from "drizzle-orm";
import { chats } from "../database/schema";
import { BaseRepository } from "./base-repository";

export interface ChatFormData {
  tagId: number;
  content?: string;
  role: "system" | "user";
  type: "chat" | "note" | "clipboard" | "clear";
  image?: string;
  inserted?: boolean;
}

export interface ChatEntity {
  id: number;
  tagId: number;
  content: string | null;
  role: "system" | "user";
  type: "chat" | "note" | "clipboard" | "clear";
  image: string | null;
  inserted: boolean;
  createdAt: number;
}

/**
 * 聊天记录Repository - 简化版
 */
export class ChatsRepository extends BaseRepository {
  /**
   * 根据标签获取聊天记录
   */
  async findByTag(tagId: number): Promise<ChatEntity[]> {
    const result = await this.db
      .select({
        id: chats.id,
        tagId: chats.tagId,
        content: chats.content,
        role: chats.role,
        type: chats.type,
        image: chats.image,
        inserted: chats.inserted,
        createdAt: chats.createdAt
      })
      .from(chats)
      .where(eq(chats.tagId, tagId))
      .orderBy(chats.createdAt);

    return result as ChatEntity[];
  }

  /**
   * 创建聊天记录
   */
  async create(data: ChatFormData): Promise<ChatEntity> {
    const now = this.now();

    const result = await this.db
      .insert(chats)
      .values({
        tagId: data.tagId,
        content: data.content || null,
        role: data.role,
        type: data.type,
        image: data.image || null,
        inserted: data.inserted || false,
        createdAt: now
      })
      .returning();

    return result[0] as ChatEntity;
  }

  /**
   * 更新聊天记录
   */
  async update(id: number, data: Partial<ChatFormData>): Promise<ChatEntity> {
    await this.checkExists(chats, chats.id, id, "聊天记录不存在");

    const updateData: Record<string, unknown> = {};
    if (data.tagId !== undefined) updateData.tagId = data.tagId;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.inserted !== undefined) updateData.inserted = data.inserted;

    await this.db.update(chats).set(updateData).where(eq(chats.id, id));

    const result = await this.db.select().from(chats).where(eq(chats.id, id)).limit(1);

    return result[0] as ChatEntity;
  }

  /**
   * 删除聊天记录
   */
  async delete(id: number): Promise<{ id: number }> {
    await this.checkExists(chats, chats.id, id, "聊天记录不存在");
    await this.db.delete(chats).where(eq(chats.id, id));
    return { id };
  }

  /**
   * 清空指定标签的聊天记录
   */
  async clearByTag(tagId: number): Promise<{ deletedCount: number }> {
    const result = await this.db.delete(chats).where(eq(chats.tagId, tagId));
    return { deletedCount: result.changes || 0 };
  }

  /**
   * 更新插入状态
   */
  async updateInserted(id: number, inserted: boolean): Promise<ChatEntity> {
    await this.checkExists(chats, chats.id, id, "聊天记录不存在");

    await this.db.update(chats).set({ inserted }).where(eq(chats.id, id));

    const result = await this.db.select().from(chats).where(eq(chats.id, id)).limit(1);

    return result[0] as ChatEntity;
  }
}
