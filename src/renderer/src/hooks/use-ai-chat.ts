import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { type AIConfig, type Message } from "@renderer/stores";
import { AIService } from "@renderer/api/ai";
import { ErrorHandler } from "@renderer/lib/error-handler";

// AI API 使用的消息格式
interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface UseAIChatOptions {
  config: AIConfig;
  onMessageAdd: (message: Omit<Message, "id" | "timestamp">) => void;
}

export function useAIChat({ config, onMessageAdd }: UseAIChatOptions) {
  // 使用 ref 存储当前会话的消息历史（AI API 格式）
  const messagesRef = useRef<AIMessage[]>([]);

  // 使用 React Query 的 mutation 处理 AI 调用
  const aiMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      // 添加用户消息到历史（AI API 格式）
      const userMsg: AIMessage = {
        role: "user",
        content: userMessage.trim()
      };
      messagesRef.current = [...messagesRef.current, userMsg];

      // 调用 AI API
      const response = await AIService.chat(config, messagesRef.current);
      return response;
    },
    onMutate: (userMessage) => {
      // 立即添加用户消息到 UI（Chat Store 格式）
      onMessageAdd({
        role: "user",
        content: userMessage.trim()
      });
    },
    onSuccess: (response) => {
      // 添加 AI 响应到历史（AI API 格式）
      const aiMsgForAPI: AIMessage = {
        role: "assistant",
        content: response.content
      };
      messagesRef.current = [...messagesRef.current, aiMsgForAPI];

      // 添加 AI 响应到 UI（Chat Store 格式）
      onMessageAdd({
        role: "assistant",
        content: response.content
      });
    },
    onError: (error) => {
      // 使用你的错误处理器
      ErrorHandler.handle(error, "AI Chat");

      // 从消息历史中移除失败的用户消息
      messagesRef.current = messagesRef.current.slice(0, -1);
    }
  });

  const sendMessage = useCallback(
    (message: string) => {
      if (!config || !message.trim() || aiMutation.isPending) return;
      aiMutation.mutate(message);
    },
    [config, aiMutation]
  );

  // 清空消息历史（新会话时使用）
  const clearHistory = useCallback(() => {
    messagesRef.current = [];
  }, []);

  return {
    sendMessage,
    clearHistory,
    isLoading: aiMutation.isPending,
    error: aiMutation.error
  };
}
