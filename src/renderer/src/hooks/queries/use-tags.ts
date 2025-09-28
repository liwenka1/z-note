// ==================== 标签查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";

/**
 * 获取所有标签
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.lists(),
    queryFn: () => tagsApi.getAll()
  });
}

/**
 * 获取热门标签（按名称排序）
 */
export function usePopularTags(limit = 10) {
  return useQuery({
    queryKey: ["tags", "popular", limit],
    queryFn: async () => {
      const tags = await tagsApi.getAll();
      return tags.sort((a, b) => a.name.localeCompare(b.name)).slice(0, limit);
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
