// ==================== 文件夹查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { foldersApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { Folder, FolderTreeItem } from "@renderer/types";

/**
 * 获取文件夹列表
 */
export function useFolders() {
  return useQuery({
    queryKey: queryKeys.folders.lists(),
    queryFn: () => foldersApi.getList(),
    select: (folders: Folder[]) => folders.filter((folder) => !folder.isDeleted)
  });
}

/**
 * 获取单个文件夹
 */
export function useFolder(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.folders.detail(id),
    queryFn: () => foldersApi.getById(id),
    enabled: enabled && !!id
  });
}

/**
 * 获取文件夹树结构
 */
export function useFolderTree() {
  return useQuery({
    queryKey: ["folders", "tree"],
    queryFn: async (): Promise<FolderTreeItem[]> => {
      const folders = await foldersApi.getList();
      const activeFolders = folders.filter((folder) => !folder.isDeleted);

      // 构建树结构
      const buildTree = (parentId?: string, level = 0): FolderTreeItem[] => {
        return activeFolders
          .filter((folder) => folder.parentId === parentId)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((folder) => ({
            ...folder,
            children: buildTree(folder.id, level + 1),
            level,
            isExpanded: level < 2 // 默认展开前两层
          }));
      };

      return buildTree();
    }
  });
}

/**
 * 获取根级文件夹
 */
export function useRootFolders() {
  const { data: folders } = useFolders();

  return {
    data: folders?.filter((folder) => !folder.parentId) || [],
    isLoading: !folders
  };
}

/**
 * 获取子文件夹
 */
export function useSubFolders(parentId: string) {
  const { data: folders } = useFolders();

  return {
    data: folders?.filter((folder) => folder.parentId === parentId) || [],
    isLoading: !folders
  };
}
