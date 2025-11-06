// ==================== 高性能搜索 Hook ====================

import { useState, useEffect, useMemo, useCallback } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { fileSearchIndex, type SearchIndexItem } from "@renderer/services/file-search-index";
import { useTags } from "@renderer/hooks/queries/use-tags";
import type { SearchItem } from "../types";

/**
 * 搜索配置选项
 */
interface SearchOptions {
  /** 搜索阈值 (0-1)，越小越严格 */
  threshold?: number;
  /** 防抖延迟 (ms) */
  debounceDelay?: number;
  /** 最大结果数量 */
  maxResults?: number;
  /** 是否包含匹配信息 */
  includeMatches?: boolean;
  /** 是否启用高亮 */
  enableHighlight?: boolean;
}

/**
 * 扩展的搜索索引项（支持标签）
 */
interface ExtendedSearchIndexItem {
  id: string;
  title: string;
  content: string;
  fullText: string;
  path: string;
  type: "note" | "file" | "tag";
  // 标签特有属性
  isLocked?: boolean;
  isPin?: boolean;
}

/**
 * 搜索结果项（带高亮信息）
 */
interface SearchResultItem extends SearchItem {
  matches?: readonly FuseResultMatch[];
  score?: number;
}

/**
 * 高性能搜索Hook - 完全效仿 z-note Tauri 项目
 */
export function useAdvancedSearch(options: SearchOptions = {}) {
  const {
    threshold = 0.3,
    debounceDelay = 300,
    maxResults = 50,
    includeMatches = true,
    enableHighlight = true
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isIndexReady, setIsIndexReady] = useState(false);

  // 获取所有标签
  const { data: allTags = [] } = useTags();

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  // 创建 Fuse.js 搜索实例
  const fuseSearch = useMemo(() => {
    if (!isIndexReady) {
      return null;
    }

    const searchIndex = fileSearchIndex.getSearchIndex();

    // 将标签转换为搜索索引格式
    const tagSearchItems: ExtendedSearchIndexItem[] = allTags.map((tag) => ({
      id: String(tag.id),
      title: tag.name,
      content: tag.name,
      fullText: tag.name,
      path: `/tags/${tag.id}`,
      type: "tag" as const,
      isLocked: tag.isLocked,
      isPin: tag.isPin
    }));

    // 合并笔记索引和标签索引
    const noteSearchItems: ExtendedSearchIndexItem[] = (searchIndex || []).map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      fullText: item.fullText,
      path: item.path,
      type: item.type as "note" | "file"
    }));

    const combinedIndex = [...noteSearchItems, ...tagSearchItems];

    if (!Array.isArray(combinedIndex) || combinedIndex.length === 0) {
      return null;
    }

    return new Fuse(combinedIndex, {
      // 搜索字段配置 - 效仿 ['desc', 'article', 'title', 'path']
      keys: [
        { name: "title", weight: 0.4 }, // 标题权重最高
        { name: "content", weight: 0.3 }, // 内容权重次之（效仿 'article'）
        { name: "fullText", weight: 0.2 }, // 全文权重
        { name: "path", weight: 0.1 } // 路径权重最低
      ],
      // 搜索配置 - 效仿 Tauri 项目
      includeScore: true,
      includeMatches: includeMatches,
      threshold: threshold,
      // 高级配置
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      useExtendedSearch: true,
      ignoreLocation: true,
      ignoreFieldNorm: false
    });
  }, [threshold, includeMatches, isIndexReady, allTags]);

  // 执行搜索
  const performSearch = useCallback(
    async (query: string) => {
      if (!fuseSearch || !query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      // 生成搜索结果描述
      const generateDescription = (item: SearchIndexItem, matches?: readonly FuseResultMatch[]): string => {
        if (!enableHighlight || !matches) {
          // 简单截取内容片段
          return item.content.slice(0, 100) + (item.content.length > 100 ? "..." : "");
        }

        // 尝试从匹配信息中生成高亮描述
        const contentMatch = matches.find((match) => match.key === "content" || match.key === "fullText");
        if (contentMatch && contentMatch.value) {
          const snippet = generateHighlightSnippet(contentMatch.value, contentMatch.indices);
          return snippet || item.content.slice(0, 100) + "...";
        }

        return item.content.slice(0, 100) + (item.content.length > 100 ? "..." : "");
      };

      try {
        // 执行模糊搜索
        const fuseResults = fuseSearch.search(query, { limit: maxResults });

        const results: SearchResultItem[] = fuseResults.map((result) => {
          const item = result.item as ExtendedSearchIndexItem;

          // 根据类型生成不同的 SearchItem
          if (item.type === "tag") {
            return {
              id: item.id,
              title: item.title,
              type: "tag" as const,
              description: `${item.isPin ? "📌 " : ""}${item.isLocked ? "🔒 " : ""}标签`,
              icon: item.isPin ? "📌" : "🏷️",
              path: `/tags/${item.id}`,
              isLocked: item.isLocked,
              isPin: item.isPin,
              matches: result.matches,
              score: result.score
            };
          }

          // 原有的笔记类型处理
          return {
            id: item.id,
            title: item.title,
            type: "note",
            description: generateDescription(item as SearchIndexItem, result.matches),
            icon: "📝",
            path: item.path,
            matches: result.matches,
            score: result.score
          };
        });

        setSearchResults(results);
      } catch (error) {
        console.error("搜索失败:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [enableHighlight, fuseSearch, maxResults]
  );

  // 响应搜索词变化
  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  // 初始化索引
  useEffect(() => {
    let isStale = false; // 防止组件卸载后状态更新

    const initializeIndex = async () => {
      if (isStale) return;

      setIsIndexReady(false);
      try {
        // 不传递路径参数，让 fileSearchIndex 自己获取当前工作区路径
        await fileSearchIndex.buildIndex();

        if (isStale) return;

        // 确保buildIndex完全完成
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (isStale) return;

        setIsIndexReady(true);
      } catch (error) {
        console.error("初始化索引失败:", error);
        if (!isStale) {
          setIsIndexReady(true);
        }
      }
    };

    initializeIndex();

    return () => {
      isStale = true; // 组件卸载时标记为stale
    };
  }, []);

  // 监听文件变化，自动更新 Fuse 实例
  useEffect(() => {
    const unsubscribe = fileSearchIndex.addFileWatcher(() => {
      // 文件变化时，强制重新创建 Fuse 实例
      // 通过依赖数组中的 isIndexReady 变化来触发 fuseSearch 的重新计算
      setIsIndexReady(false);
      // 短暂延迟后重新设置为 true，触发 Fuse 实例重建
      setTimeout(() => setIsIndexReady(true), 50);
    });

    return unsubscribe;
  }, []);

  // 生成高亮片段
  const generateHighlightSnippet = (text: string, indices: readonly [number, number][] = []): string => {
    if (indices.length === 0) return text.slice(0, 100) + "...";

    // 找到第一个匹配位置
    const firstMatch = indices[0];
    const start = Math.max(0, firstMatch[0] - 50);
    const end = Math.min(text.length, firstMatch[1] + 50);

    let snippet = text.slice(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";

    return snippet;
  };

  // 重建索引
  const rebuildIndex = useCallback(async () => {
    setIsIndexReady(false);
    try {
      // 不传递路径参数，让 fileSearchIndex 自己获取当前工作区路径
      await fileSearchIndex.buildIndex();
      setIsIndexReady(true);
    } catch (error) {
      console.error("重建索引失败:", error);
      setIsIndexReady(true);
    }
  }, []);

  // 更新文件索引
  const updateFileIndex = useCallback(async (filePath: string) => {
    try {
      await fileSearchIndex.updateFileIndex(filePath);
    } catch (error) {
      console.error("更新文件索引失败:", error);
    }
  }, []);

  return {
    // 搜索状态
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    isIndexReady,

    // 搜索结果分组（保持与原接口兼容）
    groupedResults: useMemo(
      () => ({
        notes: searchResults.filter((item) => item.type === "note"),
        pages: [],
        folders: [],
        tags: searchResults.filter((item) => item.type === "tag")
      }),
      [searchResults]
    ),

    // 工具方法
    rebuildIndex,
    updateFileIndex,

    // 索引统计
    indexStats: fileSearchIndex.getIndexStats()
  };
}
