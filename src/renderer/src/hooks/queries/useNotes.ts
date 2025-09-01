// ==================== 笔记查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { notesApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { Note } from "@renderer/types/entities";
import type { GetNotesRequest } from "@renderer/types/api";

/**
 * 获取笔记列表
 */
export function useNotes(params?: GetNotesRequest) {
  return useQuery({
    queryKey: queryKeys.notes.list(params as Record<string, unknown>),
    queryFn: () => notesApi.getList(params),
    enabled: true
  });
}

/**
 * 获取单个笔记
 */
export function useNote(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notes.detail(id),
    queryFn: () => notesApi.getById(id),
    enabled: enabled && !!id
  });
}

/**
 * 获取收藏笔记
 */
export function useFavoriteNotes() {
  // const queryClient = useQueryClient(); // 暂未使用

  return useQuery({
    queryKey: ["notes", "favorites"],
    queryFn: async () => {
      const allNotes = await notesApi.getList();
      return allNotes.filter((note) => note.isFavorite);
    },
    select: (notes: Note[]) => notes.filter((note) => !note.isDeleted)
  });
}

/**
 * 根据文件夹获取笔记
 */
export function useNotesByFolder(folderId?: string) {
  return useQuery({
    queryKey: queryKeys.notes.list({ folderId }),
    queryFn: () => notesApi.getList({ folderId }),
    enabled: !!folderId
  });
}

/**
 * 根据标签获取笔记
 */
export function useNotesByTags(tagIds: string[]) {
  return useQuery({
    queryKey: queryKeys.notes.list({ tagIds }),
    queryFn: () => notesApi.getList({ tagIds }),
    enabled: tagIds.length > 0
  });
}

/**
 * 搜索笔记
 */
export function useSearchNotes(searchQuery: string) {
  return useQuery({
    queryKey: ["notes", "search", searchQuery],
    queryFn: () => notesApi.getList({ search: searchQuery }),
    enabled: searchQuery.trim().length > 0,
    // 防抖，300ms 后执行搜索
    staleTime: 300
  });
}
