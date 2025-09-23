import { ipcClient, handleResponse } from "./ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";
import { type AIConfig } from "@renderer/stores/ai-config-store";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatResponse {
  content: string;
  model: string;
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
  static async chat(config: AIConfig, messages: ChatMessage[]): Promise<ChatResponse> {
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
}
