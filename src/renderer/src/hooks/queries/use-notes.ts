// ==================== 笔记查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { notesApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";

/**
 * 根据标签获取笔记列表
 */
export function useNotesByTag(tagId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notes.list({ tagId }),
    queryFn: () => notesApi.getByTag(tagId),
    enabled: enabled && !!tagId
  });
}

/**
 * 获取单个笔记
 */
export function useNote(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notes.detail(id.toString()),
    queryFn: () => notesApi.getById(id),
    enabled: enabled && !!id
  });
}
