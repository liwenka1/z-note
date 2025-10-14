import { ChatsRepository } from "../repositories/chats-repository";
import type { Chat, ChatFormData } from "@shared/types";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

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
  async getChatsByTag(tagId: number): Promise<Chat[]> {
    return await this.chatsRepository.findByTag(tagId);
  }

  /**
   * 创建聊天记录
   */
  async createChat(data: ChatFormData): Promise<Chat> {
    return await this.chatsRepository.create(data);
  }

  /**
   * 更新聊天记录
   */
  async updateChat(id: number, data: Partial<ChatFormData>): Promise<Chat> {
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
  async updateInserted(id: number, inserted: boolean): Promise<Chat> {
    return await this.chatsRepository.updateInserted(id, inserted);
  }

  /**
   * 注册聊天相关的 IPC 处理器
   */
  registerChatsHandlers(): void {
    // 根据标签获取聊天记录
    registerHandler(IPC_CHANNELS.CHATS.GET_BY_TAG, async (tagId: number) => {
      return await this.getChatsByTag(tagId);
    });

    // 创建聊天记录
    registerHandler(IPC_CHANNELS.CHATS.CREATE, async (data: ChatFormData) => {
      return await this.createChat(data);
    });

    // 更新聊天记录
    registerHandler(IPC_CHANNELS.CHATS.UPDATE, async (id: number, data: Partial<ChatFormData>) => {
      return await this.updateChat(id, data);
    });

    // 删除聊天记录
    registerHandler(IPC_CHANNELS.CHATS.DELETE, async (id: number) => {
      return await this.deleteChat(id);
    });

    // 清空标签下的聊天记录
    registerHandler(IPC_CHANNELS.CHATS.CLEAR_BY_TAG, async (tagId: number) => {
      return await this.clearChatsByTag(tagId);
    });

    // 更新插入状态
    registerHandler(IPC_CHANNELS.CHATS.UPDATE_INSERTED, async (id: number, inserted: boolean) => {
      return await this.updateInserted(id, inserted);
    });
  }
}
