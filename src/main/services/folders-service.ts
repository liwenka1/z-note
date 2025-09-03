import { FoldersRepository } from "../repositories/folders-repository";
import { BaseService } from "./base-service";
import { ValidatorFactory } from "../validators";
import { generateId } from "../utils/helpers";
import type { FolderFormData } from "../../renderer/src/types/entities";

/**
 * 文件夹业务逻辑层
 */
export class FoldersService extends BaseService {
  private foldersRepository: FoldersRepository;

  constructor() {
    super();
    this.foldersRepository = new FoldersRepository();
  }

  /**
   * 获取文件夹列表
   */
  async getFolders() {
    try {
      return await this.foldersRepository.findMany();
    } catch (error) {
      throw new Error(`获取文件夹列表失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 获取文件夹树结构
   */
  async getFolderTree() {
    try {
      return await this.foldersRepository.getFolderTree();
    } catch (error) {
      throw new Error(`获取文件夹树失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 获取单个文件夹
   */
  async getFolder(id: string) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    try {
      const folder = await this.foldersRepository.findById(id);
      if (!folder) {
        throw new Error("文件夹不存在");
      }
      return folder;
    } catch (error) {
      throw new Error(`获取文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 创建文件夹
   */
  async createFolder(data: FolderFormData) {
    // 使用验证器工厂验证文件夹数据
    const validators = ValidatorFactory.createFolderValidator({
      name: data.name,
      parentId: data.parentId ? Number(data.parentId) : undefined
    });

    this.createBatchValidator().add(validators.name).add(validators.parentId).validateOrThrow();

    if (data.color) {
      this.createValidator("颜色", data.color).stringLength(1, 20).validateOrThrow();
    }

    if (data.icon) {
      this.createValidator("图标", data.icon).stringLength(1, 10).validateOrThrow();
    }

    // 验证父文件夹
    if (data.parentId) {
      const parentExists = await this.foldersRepository.isValidParent(data.parentId);
      if (!parentExists) {
        throw new Error("父文件夹不存在或已被删除");
      }
    }

    try {
      const id = generateId();
      return await this.foldersRepository.create(data, id);
    } catch (error) {
      throw new Error(`创建文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 更新文件夹
   */
  async updateFolder(id: string, data: Partial<FolderFormData>) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    // 检查文件夹是否存在
    await this.getFolder(id);

    // 验证字段长度
    if (data.name !== undefined) {
      this.createValidator("文件夹名称", data.name).stringLength(1, 100).validateOrThrow();
    }

    if (data.color !== undefined) {
      this.createValidator("颜色", data.color).stringLength(1, 20).validateOrThrow();
    }

    if (data.icon !== undefined) {
      this.createValidator("图标", data.icon).stringLength(1, 10).validateOrThrow();
    }

    // 验证父文件夹移动
    if (data.parentId !== undefined) {
      if (data.parentId) {
        // 检查父文件夹是否存在
        const parentExists = await this.foldersRepository.isValidParent(data.parentId);
        if (!parentExists) {
          throw new Error("目标父文件夹不存在或已被删除");
        }

        // 检查是否会造成循环引用
        const wouldCycle = await this.foldersRepository.wouldCreateCycle(id, data.parentId);
        if (wouldCycle) {
          throw new Error("不能移动到子文件夹中，这会造成循环引用");
        }
      }
    }

    try {
      return await this.foldersRepository.update(id, data);
    } catch (error) {
      throw new Error(`更新文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 删除文件夹（软删除）
   */
  async deleteFolder(id: string) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    // 检查文件夹是否存在
    await this.getFolder(id);

    // 检查是否有子文件夹
    const hasSubfolders = await this.foldersRepository.hasSubfolders(id);
    if (hasSubfolders) {
      throw new Error("不能删除包含子文件夹的文件夹，请先删除或移动子文件夹");
    }

    // 检查是否有笔记
    const hasNotes = await this.foldersRepository.hasNotes(id);
    if (hasNotes) {
      throw new Error("不能删除包含笔记的文件夹，请先删除或移动笔记");
    }

    try {
      return await this.foldersRepository.softDelete(id);
    } catch (error) {
      throw new Error(`删除文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 恢复文件夹
   */
  async restoreFolder(id: string) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    try {
      const folder = await this.foldersRepository.findById(id);
      if (!folder) {
        throw new Error("文件夹不存在");
      }

      if (!folder.isDeleted) {
        throw new Error("文件夹未被删除，无需恢复");
      }

      // 检查父文件夹是否仍然存在且未被删除
      if (folder.parentId) {
        const parentExists = await this.foldersRepository.isValidParent(folder.parentId);
        if (!parentExists) {
          // 如果父文件夹不存在或已删除，将文件夹移动到根目录
          await this.foldersRepository.update(id, { parentId: undefined });
        }
      }

      return await this.foldersRepository.restore(id);
    } catch (error) {
      throw new Error(`恢复文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 永久删除文件夹
   */
  async permanentDeleteFolder(id: string) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    try {
      const folder = await this.foldersRepository.findById(id);
      if (!folder) {
        throw new Error("文件夹不存在");
      }

      // 检查是否有子文件夹
      const hasSubfolders = await this.foldersRepository.hasSubfolders(id);
      if (hasSubfolders) {
        throw new Error("不能永久删除包含子文件夹的文件夹");
      }

      // 检查是否有笔记
      const hasNotes = await this.foldersRepository.hasNotes(id);
      if (hasNotes) {
        throw new Error("不能永久删除包含笔记的文件夹");
      }

      return await this.foldersRepository.permanentDelete(id);
    } catch (error) {
      throw new Error(`永久删除文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 移动文件夹
   */
  async moveFolder(id: string, newParentId?: string) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    // 检查文件夹是否存在
    await this.getFolder(id);

    // 如果有新的父文件夹，验证其存在性
    if (newParentId) {
      const parentExists = await this.foldersRepository.isValidParent(newParentId);
      if (!parentExists) {
        throw new Error("目标父文件夹不存在或已被删除");
      }

      // 检查是否会造成循环引用
      const wouldCycle = await this.foldersRepository.wouldCreateCycle(id, newParentId);
      if (wouldCycle) {
        throw new Error("不能移动到子文件夹中，这会造成循环引用");
      }
    }

    try {
      return await this.foldersRepository.update(id, { parentId: newParentId });
    } catch (error) {
      throw new Error(`移动文件夹失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  /**
   * 获取文件夹的祖先路径
   */
  async getFolderPath(id: string) {
    this.createValidator("文件夹ID", id).required().validateOrThrow();

    try {
      const ancestorIds = await this.foldersRepository.getAncestorIds(id);
      const pathFolders: Array<{
        id: string;
        name: string;
        parentId: string | null;
        color: string | null;
        icon: string | null;
        isDeleted: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        noteCount: number;
      }> = [];

      // 获取当前文件夹
      const currentFolder = await this.getFolder(id);
      pathFolders.unshift(currentFolder);

      // 获取所有祖先文件夹
      for (const ancestorId of ancestorIds) {
        const ancestor = await this.foldersRepository.findById(ancestorId);
        if (ancestor) {
          pathFolders.unshift(ancestor);
        }
      }

      return pathFolders;
    } catch (error) {
      throw new Error(`获取文件夹路径失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }
}
