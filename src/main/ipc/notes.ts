import { registerHandler } from "./registry";
import { NotesService } from "../services/notes-service";
import type { NoteFormData } from "../../renderer/src/types/entities";
import type { GetNotesRequest } from "../../renderer/src/types/api";

// 创建服务实例
const notesService = new NotesService();

// 获取笔记列表
async function getNotes(params?: GetNotesRequest) {
  return notesService.getNotes(params);
}

// 获取单个笔记
async function getNote(id: string) {
  return notesService.getNote(id);
}

// 创建笔记
async function createNote(data: NoteFormData) {
  return notesService.createNote(data);
}

// 更新笔记
async function updateNote(id: string, data: Partial<NoteFormData>) {
  return notesService.updateNote(id, data);
}

// 删除笔记（软删除）
async function deleteNote(id: string) {
  return notesService.deleteNote(id);
}

// 切换收藏状态
async function toggleFavorite(id: string) {
  return notesService.toggleFavorite(id);
}

// 恢复笔记（从垃圾箱中恢复）
async function restoreNote(id: string) {
  return notesService.restoreNote(id);
}

// 永久删除笔记
async function permanentDeleteNote(id: string) {
  return notesService.permanentDeleteNote(id);
}

// 批量删除笔记
async function batchDeleteNotes(ids: string[]) {
  return notesService.batchDeleteNotes(ids);
}

// 搜索笔记
async function searchNotes(query: string) {
  return notesService.searchNotes(query);
}

// 注册IPC处理器
export function registerNotesHandlers() {
  registerHandler("notes:list", (_event: unknown, params?: GetNotesRequest) => getNotes(params));

  registerHandler("notes:get", (_event: unknown, id: string) => getNote(id));

  registerHandler("notes:create", (_event: unknown, data: NoteFormData) => createNote(data));

  registerHandler("notes:update", (_event: unknown, id: string, data: Partial<NoteFormData>) => updateNote(id, data));

  registerHandler("notes:delete", (_event: unknown, id: string) => deleteNote(id));

  registerHandler("notes:toggle-favorite", (_event: unknown, id: string) => toggleFavorite(id));

  registerHandler("notes:restore", (_event: unknown, id: string) => restoreNote(id));

  registerHandler("notes:permanent-delete", (_event: unknown, id: string) => permanentDeleteNote(id));

  registerHandler("notes:batch-delete", (_event: unknown, ids: string[]) => batchDeleteNotes(ids));

  registerHandler("notes:search", (_event: unknown, query: string) => searchNotes(query));
}
