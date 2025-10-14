import { TagsRepository } from "../repositories/tags-repository";
import type { Tag, TagFormData } from "@shared/types";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 标签服务 - 简化版
 */
export class TagsService {
  private tagsRepository: TagsRepository;

  constructor() {
    this.tagsRepository = new TagsRepository();
  }

  /**
   * 获取所有标签
   */
  async getAllTags(): Promise<Tag[]> {
    return await this.tagsRepository.findAll();
  }

  /**
   * 创建标签
   */
  async createTag(data: TagFormData): Promise<Tag> {
    return await this.tagsRepository.create(data);
  }

  /**
   * 更新标签
   */
  async updateTag(id: number, data: Partial<TagFormData>): Promise<Tag> {
    return await this.tagsRepository.update(id, data);
  }

  /**
   * 删除标签
   */
  async deleteTag(id: number): Promise<{ id: number }> {
    return await this.tagsRepository.delete(id);
  }

  /**
   * 删除所有标签
   */
  async deleteAllTags(): Promise<{ deletedCount: number }> {
    return await this.tagsRepository.deleteAll();
  }

  /**
   * 注册标签相关的 IPC 处理器
   */
  registerTagsHandlers(): void {
    // 获取所有标签
    registerHandler(IPC_CHANNELS.TAGS.GET_ALL, async () => {
      return await this.getAllTags();
    });

    // 创建标签
    registerHandler(IPC_CHANNELS.TAGS.CREATE, async (data: TagFormData) => {
      return await this.createTag(data);
    });

    // 更新标签
    registerHandler(IPC_CHANNELS.TAGS.UPDATE, async (id: number, data: Partial<TagFormData>) => {
      return await this.updateTag(id, data);
    });

    // 删除标签
    registerHandler(IPC_CHANNELS.TAGS.DELETE, async (id: number) => {
      return await this.deleteTag(id);
    });

    // 删除所有标签
    registerHandler(IPC_CHANNELS.TAGS.DELETE_ALL, async () => {
      return await this.deleteAllTags();
    });
  }
}
