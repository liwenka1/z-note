// ==================== 标签变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { Tag, TagFormData } from "@shared/types";

/**
 * 创建标签
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagFormData) => tagsApi.create(data),
    onSuccess: (newTag: Tag) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });

      console.log("✅ 标签创建成功:", newTag.name);
    },
    onError: (error) => {
      console.error("❌ 标签创建失败:", error);
    }
  });
}

/**
 * 更新标签
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TagFormData> }) => tagsApi.update(id, data),
    onSuccess: (updatedTag: Tag) => {
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });

      console.log("✅ 标签更新成功:", updatedTag.name);
    },
    onError: (error) => {
      console.error("❌ 标签更新失败:", error);
    }
  });
}

/**
 * 删除标签
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagsApi.delete(id),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });

      // 同时刷新笔记列表（因为标签删除可能影响笔记显示）
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      console.log("✅ 标签删除成功");
    },
    onError: (error) => {
      console.error("❌ 标签删除失败:", error);
    }
  });
}

/**
 * 删除所有标签
 */
export function useDeleteAllTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tagsApi.deleteAll(),
    onSuccess: (result) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() });

      console.log(`✅ 删除所有标签成功: ${result.deletedCount} 个标签被删除`);
    },
    onError: (error) => {
      console.error("❌ 删除所有标签失败:", error);
    }
  });
}
