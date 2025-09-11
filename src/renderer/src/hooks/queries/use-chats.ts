// ==================== 聊天记录查询 Hooks ====================

import { useQuery } from "@tanstack/react-query";
import { chatsApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";

/**
 * 根据标签获取聊天记录
 */
export function useChatsByTag(tagId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.chats.list({ tagId }),
    queryFn: () => chatsApi.getByTag(tagId),
    enabled: enabled && !!tagId
  });
}

/**
 * 获取最近的聊天记录
 */
export function useRecentChats(tagId: number, limit = 50) {
  return useQuery({
    queryKey: ["chats", "recent", tagId, limit],
    queryFn: async () => {
      const chats = await chatsApi.getByTag(tagId);
      return chats.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
    },
    enabled: !!tagId
  });
}

/**
 * 获取系统消息
 */
export function useSystemChats(tagId: number) {
  return useQuery({
    queryKey: ["chats", "system", tagId],
    queryFn: async () => {
      const chats = await chatsApi.getByTag(tagId);
      return chats.filter((chat) => chat.role === "system");
    },
    enabled: !!tagId
  });
}

/**
 * 获取用户消息
 */
export function useUserChats(tagId: number) {
  return useQuery({
    queryKey: ["chats", "user", tagId],
    queryFn: async () => {
      const chats = await chatsApi.getByTag(tagId);
      return chats.filter((chat) => chat.role === "user");
    },
    enabled: !!tagId
  });
}
