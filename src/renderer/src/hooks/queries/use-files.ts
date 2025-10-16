// ==================== 文件查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { filesApi } from "@renderer/api/files";

/**
 * Query Key 工厂函数
 */
export const fileQueryKeys = {
  all: ["files"] as const,
  file: (filePath: string) => [...fileQueryKeys.all, "file", filePath] as const,
  metadata: (filePath: string) => [...fileQueryKeys.all, "metadata", filePath] as const
};

/**
 * 读取单个笔记文件
 * 用于替代 useActiveNote 的手写逻辑
 */
export function useNoteFile(filePath: string | null, enabled = true) {
  return useQuery({
    queryKey: fileQueryKeys.file(filePath || ""),
    queryFn: () => {
      if (!filePath) throw new Error("文件路径为空");
      return filesApi.readNoteFile(filePath);
    },
    enabled: enabled && !!filePath,
    staleTime: 30000, // 30秒内不重新获取
    retry: 1 // 只重试一次
  });
}

/**
 * 获取文件元数据（不读取完整内容）
 */
export function useFileMetadata(filePath: string | null, enabled = true) {
  return useQuery({
    queryKey: fileQueryKeys.metadata(filePath || ""),
    queryFn: () => {
      if (!filePath) throw new Error("文件路径为空");
      return filesApi.getFileMetadata(filePath);
    },
    enabled: enabled && !!filePath,
    staleTime: 60000 // 1分钟内不重新获取
  });
}

/**
 * 检查文件是否存在
 */
export function useFileExists(filePath: string | null, enabled = true) {
  return useQuery({
    queryKey: [...fileQueryKeys.all, "exists", filePath || ""] as const,
    queryFn: () => {
      if (!filePath) return false;
      return filesApi.fileExists(filePath);
    },
    enabled: enabled && !!filePath,
    staleTime: 10000 // 10秒缓存
  });
}
