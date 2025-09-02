import { registerHandler } from "./registry";
import { FoldersService } from "../services/folders-service";
import type { FolderFormData } from "../../renderer/src/types/entities";

// 创建服务实例
const foldersService = new FoldersService();

// 获取文件夹列表（包含层级关系）
async function getFolders() {
  return foldersService.getFolders();
}

// 获取单个文件夹
async function getFolder(id: string) {
  return foldersService.getFolder(id);
}

// 创建文件夹
async function createFolder(data: FolderFormData) {
  return foldersService.createFolder(data);
}

// 更新文件夹
async function updateFolder(id: string, data: Partial<FolderFormData>) {
  return foldersService.updateFolder(id, data);
}

// 删除文件夹（软删除）
async function deleteFolder(id: string) {
  return foldersService.deleteFolder(id);
}

// 恢复文件夹（从垃圾箱中恢复）
async function restoreFolder(id: string) {
  return foldersService.restoreFolder(id);
}

// 永久删除文件夹
async function permanentDeleteFolder(id: string) {
  return foldersService.permanentDeleteFolder(id);
}

// 注册IPC处理器
export function registerFoldersHandlers() {
  registerHandler("folders:list", () => getFolders());

  registerHandler("folders:get", (_event: unknown, id: string) => getFolder(id));

  registerHandler("folders:create", (_event: unknown, data: FolderFormData) => createFolder(data));

  registerHandler("folders:update", (_event: unknown, id: string, data: Partial<FolderFormData>) =>
    updateFolder(id, data)
  );

  registerHandler("folders:delete", (_event: unknown, id: string) => deleteFolder(id));

  registerHandler("folders:restore", (_event: unknown, id: string) => restoreFolder(id));

  registerHandler("folders:permanent-delete", (_event: unknown, id: string) => permanentDeleteFolder(id));
}
