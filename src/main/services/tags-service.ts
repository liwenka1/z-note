import { TagsRepository } from "../repositories/tags-repository";
import { BaseService } from "./base-service";
import { generateId } from "../utils/helpers";
import type { TagFormData } from "../../renderer/src/types/entities";

/**
 * 标签业务逻辑层
 */
export class TagsService extends BaseService {
  private tagsRepository: TagsRepository;

  constructor() {
    super();
    this.tagsRepository = new TagsRepository();
  }

  /**
   * 获取标签列表
   */
  async getTags() {
    try {
      return await this.tagsRepository.findMany();
    } catch (error) {
      throw new Error(`获取标签列表失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 获取单个标签
   */
  async getTag(id: string) {
    this.validateRequired(id, "标签ID");

    try {
      const tag = await this.tagsRepository.findById(id);
      if (!tag) {
        throw new Error("标签不存在");
      }
      return tag;
    } catch (error) {
      throw new Error(`获取标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 创建标签
   */
  async createTag(data: TagFormData) {
    // 验证必填字段
    this.validateRequired(data.name, "标签名称");
    this.validateRequired(data.color, "颜色");

    // 验证字段长度
    this.validateStringLength(data.name, "标签名称", 1, 50);
    this.validateStringLength(data.color, "颜色", 1, 20);

    // 检查名称是否已存在
    const existing = await this.tagsRepository.findByName(data.name);
    if (existing) {
      throw new Error("标签名称已存在");
    }

    try {
      const id = generateId();
      return await this.tagsRepository.create(data, id);
    } catch (error) {
      throw new Error(`创建标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 更新标签
   */
  async updateTag(id: string, data: Partial<TagFormData>) {
    this.validateRequired(id, "标签ID");

    // 检查标签是否存在
    await this.getTag(id);

    // 验证字段长度
    if (data.name !== undefined) {
      this.validateStringLength(data.name, "标签名称", 1, 50);

      // 检查名称是否已被其他标签使用
      const nameExists = await this.tagsRepository.isNameExists(data.name, id);
      if (nameExists) {
        throw new Error("标签名称已存在");
      }
    }

    if (data.color !== undefined) {
      this.validateStringLength(data.color, "颜色", 1, 20);
    }

    try {
      return await this.tagsRepository.update(id, data);
    } catch (error) {
      throw new Error(`更新标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string) {
    this.validateRequired(id, "标签ID");

    // 检查标签是否存在
    await this.getTag(id);

    try {
      return await this.tagsRepository.delete(id);
    } catch (error) {
      throw new Error(`删除标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 搜索标签
   */
  async searchTags(query: string) {
    this.validateStringLength(query, "搜索关键词", 1, 100);

    try {
      return await this.tagsRepository.search(query);
    } catch (error) {
      throw new Error(`搜索标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 获取未使用的标签
   */
  async getUnusedTags() {
    try {
      return await this.tagsRepository.findUnused();
    } catch (error) {
      throw new Error(`获取未使用标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 获取最常用的标签
   */
  async getMostUsedTags(limit: number = 10) {
    if (limit <= 0 || limit > 50) {
      throw new Error("限制数量必须在1-50之间");
    }

    try {
      return await this.tagsRepository.findMostUsed(limit);
    } catch (error) {
      throw new Error(`获取常用标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 批量创建标签
   */
  async batchCreateTags(tagsData: TagFormData[]) {
    this.validateArrayLength(tagsData, "标签数据", 1, 20);

    const results: Array<{ id: string; name: string; color: string; createdAt: Date; updatedAt: Date }> = [];
    const errors: Array<{ index: number; data: TagFormData; error: string }> = [];

    for (let i = 0; i < tagsData.length; i++) {
      try {
        const result = await this.createTag(tagsData[i]);
        results.push(result);
      } catch (error) {
        errors.push({
          index: i,
          data: tagsData[i],
          error: error instanceof Error ? error.message : "未知错误"
        });
      }
    }

    return {
      success: results,
      errors,
      successCount: results.length,
      errorCount: errors.length
    };
  }

  /**
   * 批量删除标签
   */
  async batchDeleteTags(ids: string[]) {
    this.validateArrayLength(ids, "标签ID列表", 1, 50);

    const results: Array<{ id: string }> = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of ids) {
      try {
        const result = await this.deleteTag(id);
        results.push(result);
      } catch (error) {
        errors.push({
          id,
          error: error instanceof Error ? error.message : "未知错误"
        });
      }
    }

    return {
      success: results,
      errors,
      successCount: results.length,
      errorCount: errors.length
    };
  }

  /**
   * 清理未使用的标签
   */
  async cleanupUnusedTags() {
    try {
      const unusedTags = await this.tagsRepository.findUnused();

      if (unusedTags.length === 0) {
        return {
          deletedCount: 0,
          deletedTags: []
        };
      }

      const ids = unusedTags.map((tag) => tag.id);
      const result = await this.batchDeleteTags(ids);

      return {
        deletedCount: result.successCount,
        deletedTags: result.success,
        errors: result.errors
      };
    } catch (error) {
      throw new Error(`清理未使用标签失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }
}
