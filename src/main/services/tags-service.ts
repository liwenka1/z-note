import { TagsRepository } from "../repositories/tags-repository";
import type { TagFormData, TagEntity } from "../repositories/types";

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
  async getAllTags(): Promise<TagEntity[]> {
    return await this.tagsRepository.findAll();
  }

  /**
   * 创建标签
   */
  async createTag(data: TagFormData): Promise<TagEntity> {
    return await this.tagsRepository.create(data);
  }

  /**
   * 更新标签
   */
  async updateTag(id: number, data: Partial<TagFormData>): Promise<TagEntity> {
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
}
