// ==================== 标记收藏变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marksApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { MarkFormData } from "@shared/types";

/**
 * 创建标记
 */
export function useCreateMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkFormData) => marksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marks.lists() });
      console.log("✅ 标记创建成功");
    },
    onError: (error) => {
      console.error("❌ 标记创建失败:", error);
    }
  });
}

/**
 * 更新标记
 */
export function useUpdateMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MarkFormData> }) => marksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marks.lists() });
      console.log("✅ 标记更新成功");
    },
    onError: (error) => {
      console.error("❌ 标记更新失败:", error);
    }
  });
}

/**
 * 删除标记（软删除）
 */
export function useDeleteMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => marksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marks.lists() });
      console.log("✅ 标记删除成功");
    },
    onError: (error) => {
      console.error("❌ 标记删除失败:", error);
    }
  });
}

/**
 * 恢复标记
 */
export function useRestoreMark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => marksApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marks.lists() });
      console.log("✅ 标记恢复成功");
    },
    onError: (error) => {
      console.error("❌ 标记恢复失败:", error);
    }
  });
}

/**
 * 永久删除标记
 */
export function useDeleteMarkForever() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => marksApi.deleteForever(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marks.lists() });
      console.log("✅ 标记永久删除成功");
    },
    onError: (error) => {
      console.error("❌ 标记永久删除失败:", error);
    }
  });
}

/**
 * 清空回收站
 */
export function useClearMarkTrash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => marksApi.clearTrash(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marks.lists() });
      console.log(`✅ 清空回收站成功: ${result.deletedCount} 个标记被永久删除`);
    },
    onError: (error) => {
      console.error("❌ 清空回收站失败:", error);
    }
  });
}
