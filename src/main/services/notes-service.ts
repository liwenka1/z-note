import { NotesRepository } from "../repositories/notes-repository";
import type { NoteFormData, NoteEntity } from "../repositories/types";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * 笔记服务 - 简化版
 */
export class NotesService {
  private notesRepository: NotesRepository;

  constructor() {
    this.notesRepository = new NotesRepository();
  }

  /**
   * 根据标签获取笔记
   */
  async getNotesByTag(tagId: number): Promise<NoteEntity[]> {
    return await this.notesRepository.findByTag(tagId);
  }

  /**
   * 根据ID获取笔记
   */
  async getNoteById(id: number): Promise<NoteEntity | null> {
    return await this.notesRepository.findById(id);
  }

  /**
   * 创建笔记
   */
  async createNote(data: NoteFormData): Promise<NoteEntity> {
    return await this.notesRepository.create(data);
  }

  /**
   * 删除笔记
   */
  async deleteNote(id: number): Promise<{ id: number }> {
    return await this.notesRepository.delete(id);
  }

  /**
   * 注册笔记相关的 IPC 处理器
   */
  registerNotesHandlers(): void {
    // 根据标签获取笔记
    registerHandler(IPC_CHANNELS.NOTES.GET_BY_TAG, async (tagId: number) => {
      return await this.getNotesByTag(tagId);
    });

    // 根据ID获取笔记
    registerHandler(IPC_CHANNELS.NOTES.GET_BY_ID, async (id: number) => {
      return await this.getNoteById(id);
    });

    // 创建笔记
    registerHandler(IPC_CHANNELS.NOTES.CREATE, async (data: NoteFormData) => {
      return await this.createNote(data);
    });

    // 删除笔记
    registerHandler(IPC_CHANNELS.NOTES.DELETE, async (id: number) => {
      return await this.deleteNote(id);
    });
  }
}
