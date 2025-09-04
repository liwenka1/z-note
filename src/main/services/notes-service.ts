import { BaseService } from "./base-service";
import { NotesRepository, type NoteEntity } from "../repositories/notes-repository";
import { NoteSchemas, IdSchema, SearchQuerySchema, BatchIdsSchema } from "../schemas";
import type { NoteFormData } from "../../renderer/src/types/entities";
import type { GetNotesRequest } from "../../renderer/src/types/api";

/**
 * 笔记业务逻辑服务
 */
export class NotesService extends BaseService {
  private notesRepository: NotesRepository;

  constructor() {
    super();
    this.notesRepository = new NotesRepository();
  }

  /**
   * 获取笔记列表
   */
  async getNotes(params: GetNotesRequest = {}): Promise<NoteEntity[]> {
    return this.notesRepository.findMany(params);
  }

  /**
   * 获取单个笔记
   */
  async getNote(id: string): Promise<NoteEntity> {
    IdSchema.parse(id);
    return this.notesRepository.findByIdOrThrow(id);
  }

  /**
   * 创建笔记
   */
  async createNote(data: NoteFormData): Promise<NoteEntity> {
    // 验证输入数据
    this.validateNoteData(data);

    return this.notesRepository.create(data);
  }

  /**
   * 更新笔记
   */
  async updateNote(id: string, data: Partial<NoteFormData>): Promise<NoteEntity> {
    IdSchema.parse(id);

    // 验证更新数据
    if (data.content !== undefined) {
      NoteSchemas.update.pick({ content: true }).parse({ content: data.content }); // 1MB限制
    }

    if (data.tagIds !== undefined) {
      NoteSchemas.update.pick({ tagIds: true }).parse({ tagIds: data.tagIds });
    }

    return this.notesRepository.update(id, data);
  }

  /**
   * 删除笔记
   */
  async deleteNote(id: string): Promise<{ id: string }> {
    IdSchema.parse(id);
    return this.notesRepository.softDelete(id);
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(id: string): Promise<NoteEntity> {
    IdSchema.parse(id);
    return this.notesRepository.toggleFavorite(id);
  }

  /**
   * 恢复笔记
   */
  async restoreNote(id: string): Promise<NoteEntity> {
    IdSchema.parse(id);
    return this.notesRepository.restore(id);
  }

  /**
   * 永久删除笔记
   */
  async permanentDeleteNote(id: string): Promise<{ id: string }> {
    IdSchema.parse(id);
    return this.notesRepository.permanentDelete(id);
  }

  /**
   * 批量删除笔记
   */
  async batchDeleteNotes(ids: string[]): Promise<{ successful: number; failed: number }> {
    BatchIdsSchema.parse(ids);

    const results = await Promise.allSettled(ids.map((id) => this.notesRepository.softDelete(id)));

    const successful = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.filter((result) => result.status === "rejected").length;

    return { successful, failed };
  }

  /**
   * 批量恢复笔记
   */
  async batchRestoreNotes(ids: string[]): Promise<{ successful: number; failed: number }> {
    BatchIdsSchema.parse(ids);

    const results = await Promise.allSettled(ids.map((id) => this.notesRepository.restore(id)));

    const successful = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.filter((result) => result.status === "rejected").length;

    return { successful, failed };
  }

  /**
   * 搜索笔记
   */
  async searchNotes(query: string, folderId?: string): Promise<NoteEntity[]> {
    SearchQuerySchema.parse(query);

    return this.notesRepository.findMany({
      search: query.trim(),
      folderId,
      includeDeleted: false
    });
  }

  /**
   * 获取文件夹下的笔记
   */
  async getNotesByFolder(folderId: string): Promise<NoteEntity[]> {
    IdSchema.parse(folderId);

    return this.notesRepository.findMany({
      folderId,
      includeDeleted: false
    });
  }

  /**
   * 获取收藏的笔记
   */
  async getFavoriteNotes(): Promise<NoteEntity[]> {
    // 这里可以扩展支持更复杂的收藏笔记查询
    const allNotes = await this.notesRepository.findMany({ includeDeleted: false });
    return allNotes.filter((note) => note.isFavorite);
  }

  /**
   * 获取垃圾箱中的笔记
   */
  async getDeletedNotes(): Promise<NoteEntity[]> {
    const allNotes = await this.notesRepository.findMany({ includeDeleted: true });
    return allNotes.filter((note) => note.isDeleted);
  }

  /**
   * 验证笔记数据
   */
  private validateNoteData(data: NoteFormData): void {
    NoteSchemas.create.parse(data);
  }
}
