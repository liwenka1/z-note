import { useCallback, useRef } from "react";
import { type AIConfig, type Message } from "@renderer/stores";
import { useAIChatMutation } from "@renderer/hooks/mutations/use-ai-mutations";
import type { ChatMessage } from "@renderer/api/ai";

interface UseAIChatOptions {
  config: AIConfig;
  onMessageAdd: (message: Omit<Message, "id" | "timestamp">) => void;
}

/**
 * AI 聊天 Hook
 * 使用 React Query mutation 简化逻辑
 */
export function useAIChat({ config, onMessageAdd }: UseAIChatOptions) {
  const messagesRef = useRef<ChatMessage[]>([]);
  const chatMutation = useAIChatMutation();

  const sendMessage = useCallback(
    async (message: string) => {
      if (!config || !message.trim() || chatMutation.isPending) return;

      const userMessage = message.trim();

      // 添加用户消息到历史
      const userMsg: ChatMessage = { role: "user", content: userMessage };
      messagesRef.current = [...messagesRef.current, userMsg];

      // 立即添加到 UI
      onMessageAdd({ role: "user", content: userMessage });

      try {
        // 调用 AI API
        const response = await chatMutation.mutateAsync({
          config,
          messages: messagesRef.current
        });

        // 添加 AI 响应到历史
        const aiMsg: ChatMessage = { role: "assistant", content: response.content };
        messagesRef.current = [...messagesRef.current, aiMsg];

        // 添加到 UI
        onMessageAdd({ role: "assistant", content: response.content });
      } catch (error) {
        // 失败时移除用户消息
        messagesRef.current = messagesRef.current.slice(0, -1);
        throw error;
      }
    },
    [config, chatMutation, onMessageAdd]
  );

  // 清空消息历史（新会话时使用）
  const clearHistory = useCallback(() => {
    messagesRef.current = [];
  }, []);

  return {
    sendMessage,
    clearHistory,
    isLoading: chatMutation.isPending,
    error: chatMutation.error
  };
}
