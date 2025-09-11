// ==================== 聊天记录变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatsApi } from "@renderer/api";
import { queryKeys } from "@renderer/lib/query-client";
import type { ChatFormData } from "@renderer/types";

/**
 * 创建聊天记录
 */
export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatFormData) => chatsApi.create(data),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });

      console.log("✅ 聊天记录创建成功");
    },
    onError: (error) => {
      console.error("❌ 聊天记录创建失败:", error);
    }
  });
}

/**
 * 更新聊天记录
 */
export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ChatFormData> }) => chatsApi.update(id, data),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });

      console.log("✅ 聊天记录更新成功");
    },
    onError: (error) => {
      console.error("❌ 聊天记录更新失败:", error);
    }
  });
}

/**
 * 删除聊天记录
 */
export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => chatsApi.delete(id),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });

      console.log("✅ 聊天记录删除成功");
    },
    onError: (error) => {
      console.error("❌ 聊天记录删除失败:", error);
    }
  });
}

/**
 * 清空标签下的所有聊天记录
 */
export function useClearChatsByTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: number) => chatsApi.clearByTag(tagId),
    onSuccess: (result) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });

      console.log(`✅ 清空聊天记录成功: ${result.deletedCount} 条记录被删除`);
    },
    onError: (error) => {
      console.error("❌ 清空聊天记录失败:", error);
    }
  });
}

/**
 * 更新聊天记录的插入状态
 */
export function useUpdateChatInserted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, inserted }: { id: number; inserted: boolean }) => chatsApi.updateInserted(id, inserted),
    onSuccess: () => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });

      console.log("✅ 聊天记录插入状态更新成功");
    },
    onError: (error) => {
      console.error("❌ 聊天记录插入状态更新失败:", error);
    }
  });
}
