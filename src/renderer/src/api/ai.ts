import { ipcClient, handleResponse } from "./ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import { type AIConfig } from "@renderer/stores";
import type { AIResponse, AIStreamResponse } from "@shared/types";

// 前端简化的消息类型（与 AIMessage 类似但更简洁）
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// 流式数据块类型（前端特有，用于事件监听）
export interface StreamChunk {
  type: "chunk" | "end" | "error";
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * AI 聊天 API 服务 - 通过 IPC 调用主进程
 */
export class AIService {
  /**
   * 发送聊天消息并获取 AI 响应
   */
  static async chat(config: AIConfig, messages: ChatMessage[]): Promise<AIResponse> {
    if (!config.apiKey) {
      throw new Error("API 密钥未配置");
    }

    const response = await ipcClient.invoke(
      IPC_CHANNELS.AI.CHAT,
      {
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      },
      messages
    );

    return handleResponse(response);
  }

  /**
   * 启动流式聊天并返回清理函数
   */
  static async chatStream(
    config: AIConfig,
    messages: ChatMessage[],
    onChunk: (content: string) => void,
    onEnd: (usage?: unknown) => void,
    onError: (error: string) => void
  ): Promise<() => void> {
    if (!config.apiKey) {
      throw new Error("API 密钥未配置");
    }

    // 启动流式聊天
    const response = await ipcClient.invoke(
      IPC_CHANNELS.AI.CHAT_STREAM,
      {
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      },
      messages
    );

    const streamResponse = handleResponse(response) as AIStreamResponse;
    const { streamId } = streamResponse;

    // 监听流式数据
    const cleanup = ipcClient.on(`ai:stream-chunk:${streamId}`, (chunk: unknown) => {
      const streamChunk = chunk as StreamChunk;
      switch (streamChunk.type) {
        case "chunk":
          if (streamChunk.content) {
            onChunk(streamChunk.content);
          }
          break;
        case "end":
          onEnd(streamChunk.usage);
          cleanup(); // 自动清理监听器
          break;
        case "error":
          onError(streamChunk.error || "未知错误");
          cleanup(); // 自动清理监听器
          break;
      }
    });

    // 返回手动清理函数
    return cleanup;
  }

  /**
   * 中断流式聊天
   */
  static async abortStream(streamId: string): Promise<void> {
    try {
      const response = await ipcClient.invoke(IPC_CHANNELS.AI.ABORT_STREAM, streamId);
      handleResponse(response);
    } catch (error) {
      console.warn("中断流式聊天失败:", error);
      // 不抛出错误，因为流可能已经结束
    }
  }
}
