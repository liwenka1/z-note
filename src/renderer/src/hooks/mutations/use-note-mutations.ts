// ==================== 笔记变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import { ErrorHandler } from "@renderer/lib/error-handler";
import type { Note, NoteFormData } from "@renderer/types";

/**
 * 创建笔记
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteFormData) => notesApi.create(data),
    onSuccess: (newNote: Note) => {
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      // 可选：直接更新缓存
      queryClient.setQueryData(queryKeys.notes.detail(newNote.id.toString()), newNote);

      // 显示成功提示
      ErrorHandler.success("笔记创建成功", "笔记已创建");
    }
  });
}

/**
 * 删除笔记
 */
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notesApi.delete(id),
    onSuccess: (_, deletedId) => {
      // 移除单个笔记缓存
      queryClient.removeQueries({ queryKey: queryKeys.notes.detail(deletedId.toString()) });

      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      console.log("✅ 笔记删除成功");
    },
    onError: (error) => {
      console.error("❌ 笔记删除失败:", error);
    }
  });
}

/**
 * 批量删除笔记
 */
export function useBatchDeleteNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const results = await Promise.allSettled(ids.map((id) => notesApi.delete(id)));

      const successful = results.filter((result) => result.status === "fulfilled");
      const failed = results.filter((result) => result.status === "rejected");

      return { successful: successful.length, failed: failed.length };
    },
    onSuccess: (result, deletedIds) => {
      // 移除批量删除的笔记缓存
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: queryKeys.notes.detail(id.toString()) });
      });

      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      console.log(`✅ 批量删除完成: 成功 ${result.successful} 个，失败 ${result.failed} 个`);
    },
    onError: (error) => {
      console.error("❌ 批量删除失败:", error);
    }
  });
}
