// ==================== React Query 客户端配置 ====================

import { QueryClient } from "@tanstack/react-query";

/**
 * 创建 QueryClient 实例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5分钟后数据过期
      staleTime: 5 * 60 * 1000,
      // 垃圾回收时间
      gcTime: 10 * 60 * 1000,
      // 失败重试次数
      retry: (failureCount, error) => {
        // 网络错误重试，其他错误不重试
        if (error instanceof Error && error.message.includes("IPC")) {
          return failureCount < 2;
        }
        return false;
      },
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 重新聚焦时不重新获取
      refetchOnWindowFocus: false
    },
    mutations: {
      // 变更失败重试
      retry: 1
    }
  }
});

/**
 * 查询键工厂
 */
export const queryKeys = {
  // 笔记相关查询键
  notes: {
    all: ["notes"] as const,
    lists: () => [...queryKeys.notes.all, "list"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.notes.lists(), params] as const,
    details: () => [...queryKeys.notes.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.notes.details(), id] as const
  },

  // 文件夹相关查询键
  folders: {
    all: ["folders"] as const,
    lists: () => [...queryKeys.folders.all, "list"] as const,
    details: () => [...queryKeys.folders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.folders.details(), id] as const
  },

  // 标签相关查询键
  tags: {
    all: ["tags"] as const,
    lists: () => [...queryKeys.tags.all, "list"] as const,
    details: () => [...queryKeys.tags.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tags.details(), id] as const
  }
} as const;
