// ==================== 标记收藏查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { marksApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";

/**
 * 根据标签获取标记列表
 */
export function useMarksByTag(tagId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.marks.list({ tagId }),
    queryFn: () => marksApi.getByTag(tagId),
    enabled: enabled && !!tagId
  });
}

/**
 * 获取所有标记
 */
export function useMarks(includeDeleted = false) {
  return useQuery({
    queryKey: queryKeys.marks.list({ includeDeleted }),
    queryFn: () => marksApi.getAll(includeDeleted)
  });
}

/**
 * 获取已删除的标记（回收站）
 */
export function useDeletedMarks() {
  return useQuery({
    queryKey: ["marks", "deleted"],
    queryFn: async () => {
      const allMarks = await marksApi.getAll(true);
      return allMarks.filter((mark) => mark.deleted > 0);
    }
  });
}

/**
 * 根据类型获取标记
 */
export function useMarksByType(type: "scan" | "text" | "image" | "link" | "file") {
  return useQuery({
    queryKey: ["marks", "type", type],
    queryFn: async () => {
      const allMarks = await marksApi.getAll(false);
      return allMarks.filter((mark) => mark.type === type);
    }
  });
}

/**
 * 获取最近的标记
 */
export function useRecentMarks(limit = 20) {
  return useQuery({
    queryKey: ["marks", "recent", limit],
    queryFn: async () => {
      const allMarks = await marksApi.getAll(false);
      return allMarks
        .filter((mark) => mark.createdAt)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, limit);
    }
  });
}
