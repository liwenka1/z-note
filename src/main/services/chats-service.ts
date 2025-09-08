import { ChatsRepository } from "../repositories/chats-repository";
import type { ChatFormData, ChatEntity } from "../repositories/types";

/**
 * 聊天服务 - 简化版
 */
export class ChatsService {
  private chatsRepository: ChatsRepository;

  constructor() {
    this.chatsRepository = new ChatsRepository();
  }

  /**
   * 根据标签获取聊天记录
   */
  async getChatsByTag(tagId: number): Promise<ChatEntity[]> {
    return await this.chatsRepository.findByTag(tagId);
  }

  /**
   * 创建聊天记录
   */
  async createChat(data: ChatFormData): Promise<ChatEntity> {
    return await this.chatsRepository.create(data);
  }

  /**
   * 更新聊天记录
   */
  async updateChat(id: number, data: Partial<ChatFormData>): Promise<ChatEntity> {
    return await this.chatsRepository.update(id, data);
  }

  /**
   * 删除聊天记录
   */
  async deleteChat(id: number): Promise<{ id: number }> {
    return await this.chatsRepository.delete(id);
  }

  /**
   * 清空指定标签的聊天记录
   */
  async clearChatsByTag(tagId: number): Promise<{ deletedCount: number }> {
    return await this.chatsRepository.clearByTag(tagId);
  }

  /**
   * 更新插入状态
   */
  async updateInserted(id: number, inserted: boolean): Promise<ChatEntity> {
    return await this.chatsRepository.updateInserted(id, inserted);
  }
}
