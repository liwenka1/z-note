// ==================== 向量文档查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { vectorApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";

/**
 * 根据文件名获取向量文档
 */
export function useVectorDocumentsByFilename(filename: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.vector.list({ filename }),
    queryFn: () => vectorApi.getByFilename(filename),
    enabled: enabled && !!filename
  });
}

/**
 * 获取相似的向量文档
 */
export function useSimilarVectorDocuments(embedding: string, limit = 10, enabled = true) {
  return useQuery({
    queryKey: ["vector", "similar", embedding, limit],
    queryFn: () => vectorApi.getSimilar(embedding, limit),
    enabled: enabled && !!embedding,
    staleTime: 5 * 60 * 1000 // 5分钟缓存
  });
}
