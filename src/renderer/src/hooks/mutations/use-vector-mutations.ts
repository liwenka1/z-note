// ==================== 向量文档变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vectorApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { VectorDocumentFormData } from "@renderer/types";

/**
 * 初始化向量数据库
 */
export function useInitVectorDatabase() {
  return useMutation({
    mutationFn: () => vectorApi.init(),
    onSuccess: () => {
      console.log("✅ 向量数据库初始化成功");
    },
    onError: (error) => {
      console.error("❌ 向量数据库初始化失败:", error);
    }
  });
}

/**
 * 创建或更新向量文档
 */
export function useUpsertVectorDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VectorDocumentFormData) => vectorApi.upsert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vector.lists() });
      console.log("✅ 向量文档更新成功");
    },
    onError: (error) => {
      console.error("❌ 向量文档更新失败:", error);
    }
  });
}

/**
 * 根据文件名删除向量文档
 */
export function useDeleteVectorDocumentsByFilename() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filename: string) => vectorApi.deleteByFilename(filename),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vector.lists() });
      console.log(`✅ 向量文档删除成功: ${result.deletedCount} 个文档被删除`);
    },
    onError: (error) => {
      console.error("❌ 向量文档删除失败:", error);
    }
  });
}

/**
 * 清空所有向量文档
 */
export function useClearVectorDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => vectorApi.clear(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vector.lists() });
      console.log(`✅ 清空向量文档成功: ${result.deletedCount} 个文档被删除`);
    },
    onError: (error) => {
      console.error("❌ 清空向量文档失败:", error);
    }
  });
}
