// ==================== AI 变更 Hooks ====================

import { useMutation } from "@tanstack/react-query";
import { AIService, type ChatMessage } from "@renderer/api/ai";
import { type AIConfig } from "@renderer/stores";
import { ErrorHandler } from "@renderer/lib/error-handler";

// ============ 普通 AI 聊天 Mutation ============

interface AIChatMutationOptions {
  config: AIConfig;
  messages: ChatMessage[];
}

/**
 * AI 聊天 Mutation
 * 用于替代 useAIChat 内部的 mutation
 */
export function useAIChatMutation() {
  return useMutation({
    mutationFn: async ({ config, messages }: AIChatMutationOptions) => {
      return await AIService.chat(config, messages);
    },
    onError: (error) => {
      ErrorHandler.handle(error, "AI Chat");
    }
  });
}

// ============ 流式 AI 聊天 Mutation ============

interface AIStreamMutationOptions {
  config: AIConfig;
  messages: ChatMessage[];
  onChunk: (content: string) => void;
  onEnd: (usage?: unknown) => void;
  onError: (error: string) => void;
}

/**
 * AI 流式聊天 Mutation
 * 用于替代 useStreamingChat 的复杂逻辑
 */
export function useAIStreamMutation() {
  return useMutation({
    mutationFn: async ({ config, messages, onChunk, onEnd, onError }: AIStreamMutationOptions) => {
      const cleanup = await AIService.chatStream(config, messages, onChunk, onEnd, onError);
      return { cleanup };
    },
    onError: (error) => {
      ErrorHandler.handle(error, "AI 流式聊天");
    }
  });
}

/**
 * 中断 AI 流式聊天
 */
export function useAbortAIStream() {
  return useMutation({
    mutationFn: (streamId: string) => AIService.abortStream(streamId)
  });
}
