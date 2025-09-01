// ==================== 标签查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
// import type { Tag } from "@renderer/types/entities"; // 将来扩展时使用

/**
 * 获取标签列表
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.lists(),
    queryFn: () => tagsApi.getList()
  });
}

/**
 * 获取单个标签
 */
export function useTag(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => tagsApi.getById(id),
    enabled: enabled && !!id
  });
}

/**
 * 获取热门标签（使用次数最多的标签）
 */
export function usePopularTags(limit = 10) {
  return useQuery({
    queryKey: ["tags", "popular", limit],
    queryFn: async () => {
      const tags = await tagsApi.getList();
      // 后端返回的数据应该已经包含 noteCount，这里只是示例
      // TODO: 后端实现统计数据后，这里需要调整类型
      return tags
        .sort((a, b) => {
          const aCount = (a as unknown as { noteCount?: number }).noteCount || 0;
          const bCount = (b as unknown as { noteCount?: number }).noteCount || 0;
          return bCount - aCount;
        })
        .slice(0, limit);
    }
  });
}

/**
 * 搜索标签
 */
export function useSearchTags(searchQuery: string) {
  const { data: allTags } = useTags();

  return {
    data: allTags?.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) || [],
    isLoading: !allTags
  };
}
