import { MarksRepository } from "../repositories/marks-repository";
import type { Mark, MarkFormData } from "@shared/types";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 标记服务 - 简化版
 */
export class MarksService {
  private marksRepository: MarksRepository;

  constructor() {
    this.marksRepository = new MarksRepository();
  }

  /**
   * 根据标签获取标记
   */
  async getMarksByTag(tagId: number): Promise<Mark[]> {
    return await this.marksRepository.findByTag(tagId);
  }

  /**
   * 获取所有标记（包括回收站）
   */
  async getAllMarks(includeDeleted: boolean = false): Promise<Mark[]> {
    return await this.marksRepository.findAll(includeDeleted);
  }

  /**
   * 创建标记
   */
  async createMark(data: MarkFormData): Promise<Mark> {
    return await this.marksRepository.create(data);
  }

  /**
   * 更新标记
   */
  async updateMark(id: number, data: Partial<MarkFormData>): Promise<Mark> {
    return await this.marksRepository.update(id, data);
  }

  /**
   * 删除标记（移至回收站）
   */
  async deleteMark(id: number): Promise<{ id: number }> {
    return await this.marksRepository.delete(id);
  }

  /**
   * 恢复标记
   */
  async restoreMark(id: number): Promise<Mark> {
    return await this.marksRepository.restore(id);
  }

  /**
   * 永久删除标记
   */
  async deleteMarkForever(id: number): Promise<{ id: number }> {
    return await this.marksRepository.deleteForever(id);
  }

  /**
   * 清空回收站
   */
  async clearTrash(): Promise<{ deletedCount: number }> {
    return await this.marksRepository.clearTrash();
  }

  /**
   * 注册标记相关的 IPC 处理器
   */
  registerMarksHandlers(): void {
    // 根据标签获取标记
    registerHandler(IPC_CHANNELS.MARKS.GET_BY_TAG, async (tagId: number) => {
      return await this.getMarksByTag(tagId);
    });

    // 获取所有标记
    registerHandler(IPC_CHANNELS.MARKS.GET_ALL, async (includeDeleted?: boolean) => {
      return await this.getAllMarks(includeDeleted || false);
    });

    // 创建标记
    registerHandler(IPC_CHANNELS.MARKS.CREATE, async (data: MarkFormData) => {
      return await this.createMark(data);
    });

    // 更新标记
    registerHandler(IPC_CHANNELS.MARKS.UPDATE, async (id: number, data: Partial<MarkFormData>) => {
      return await this.updateMark(id, data);
    });

    // 删除标记（移至回收站）
    registerHandler(IPC_CHANNELS.MARKS.DELETE, async (id: number) => {
      return await this.deleteMark(id);
    });

    // 恢复标记
    registerHandler(IPC_CHANNELS.MARKS.RESTORE, async (id: number) => {
      return await this.restoreMark(id);
    });

    // 永久删除标记
    registerHandler(IPC_CHANNELS.MARKS.DELETE_FOREVER, async (id: number) => {
      return await this.deleteMarkForever(id);
    });

    // 清空回收站
    registerHandler(IPC_CHANNELS.MARKS.CLEAR_TRASH, async () => {
      return await this.clearTrash();
    });
  }
}
