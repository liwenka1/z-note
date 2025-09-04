// ==================== 文件夹变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { Folder, FolderFormData } from "@renderer/types";

/**
 * 创建文件夹
 */
export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FolderFormData) => foldersApi.create(data),
    onSuccess: (newFolder: Folder) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.lists() });
      queryClient.invalidateQueries({ queryKey: ["folders", "tree"] });

      // 直接更新缓存
      queryClient.setQueryData(queryKeys.folders.detail(newFolder.id), newFolder);

      console.log("✅ 文件夹创建成功:", newFolder.name);
    },
    onError: (error) => {
      console.error("❌ 文件夹创建失败:", error);
    }
  });
}

/**
 * 更新文件夹
 */
export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FolderFormData> }) => foldersApi.update(id, data),
    onSuccess: (updatedFolder: Folder) => {
      // 更新单个文件夹缓存
      queryClient.setQueryData(queryKeys.folders.detail(updatedFolder.id), updatedFolder);

      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.lists() });
      queryClient.invalidateQueries({ queryKey: ["folders", "tree"] });

      console.log("✅ 文件夹更新成功:", updatedFolder.name);
    },
    onError: (error) => {
      console.error("❌ 文件夹更新失败:", error);
    }
  });
}

/**
 * 删除文件夹
 */
export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: (_, deletedId) => {
      // 移除单个文件夹缓存
      queryClient.removeQueries({ queryKey: queryKeys.folders.detail(deletedId) });

      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.lists() });
      queryClient.invalidateQueries({ queryKey: ["folders", "tree"] });

      // 同时刷新笔记列表（因为文件夹删除可能影响笔记）
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      console.log("✅ 文件夹删除成功");
    },
    onError: (error) => {
      console.error("❌ 文件夹删除失败:", error);
    }
  });
}

/**
 * 恢复文件夹
 */
export function useRestoreFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foldersApi.restore(id),
    onSuccess: (restoredFolder: Folder) => {
      // 更新单个文件夹缓存
      queryClient.setQueryData(queryKeys.folders.detail(restoredFolder.id), restoredFolder);

      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.lists() });
      queryClient.invalidateQueries({ queryKey: ["folders", "tree"] });

      console.log("✅ 文件夹恢复成功:", restoredFolder.name);
    },
    onError: (error) => {
      console.error("❌ 文件夹恢复失败:", error);
    }
  });
}

/**
 * 永久删除文件夹
 */
export function usePermanentDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foldersApi.permanentDelete(id),
    onSuccess: (_, deletedId) => {
      // 移除单个文件夹缓存
      queryClient.removeQueries({ queryKey: queryKeys.folders.detail(deletedId) });

      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.lists() });
      queryClient.invalidateQueries({ queryKey: ["folders", "tree"] });

      // 同时刷新笔记列表（因为文件夹删除可能影响笔记）
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      console.log("✅ 文件夹永久删除成功");
    },
    onError: (error) => {
      console.error("❌ 文件夹永久删除失败:", error);
    }
  });
}

/**
 * 移动文件夹（更改父级）
 */
export function useMoveFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId?: string }) =>
      foldersApi.update(id, { parentId: newParentId }),
    onSuccess: (movedFolder: Folder) => {
      // 更新单个文件夹缓存
      queryClient.setQueryData(queryKeys.folders.detail(movedFolder.id), movedFolder);

      // 使树结构查询失效
      queryClient.invalidateQueries({ queryKey: ["folders", "tree"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.lists() });

      console.log("✅ 文件夹移动成功:", movedFolder.name);
    },
    onError: (error) => {
      console.error("❌ 文件夹移动失败:", error);
    }
  });
}
