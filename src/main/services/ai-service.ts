import { ipcMain } from "electron";
import { registerHandler } from "../ipc/registry";
import { IPC_CHANNELS } from "@shared/ipc-channels";

/**
 * AI 配置接口
 */
export interface AIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

/**
 * AI 消息接口
 */
export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * AI 响应接口
 */
export interface AIResponse {
  content: string;
  model: string;
  usage?: unknown;
}

/**
 * AI 流式响应接口
 */
export interface AIStreamResponse {
  success: boolean;
  data: {
    streamId: string;
    model: string;
  } | null;
  message?: string;
  timestamp: number;
}

/**
 * AI 服务 (工具型服务)
 * 负责处理 AI 相关的功能，包括聊天和流式聊天
 * 不涉及数据库操作，专注于 AI SDK 调用和流式管理
 */
export class AIService {
  // 维护流式请求的 AbortController 映射
  private static streamControllers = new Map<string, AbortController>();

  /**
   * AI 聊天
   */
  async chat(config: AIConfig, messages: AIMessage[]): Promise<AIResponse> {
    try {
      // AI 调用
      const { generateText } = await import("ai");
      const { createOpenAI } = await import("@ai-sdk/openai");

      const openai = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL
      });

      const result = await generateText({
        model: openai.chat(config.model),
        messages: messages,
        temperature: config.temperature
      });

      return {
        content: result.text,
        model: config.model,
        usage: undefined
      };
    } catch (error) {
      // 统一错误处理
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          throw new Error("API 密钥无效，请检查配置");
        }
        if (error.message.includes("timeout") || error.message.includes("网络")) {
          throw new Error("网络连接超时，请重试");
        }
        if (error.message.includes("quota") || error.message.includes("limit")) {
          throw new Error("API 配额不足，请检查账户余额");
        }

        // 添加更多错误信息
        throw new Error(`AI 调用失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * AI 流式聊天
   */
  async chatStream(
    event: Electron.IpcMainInvokeEvent,
    config: AIConfig,
    messages: AIMessage[]
  ): Promise<AIStreamResponse> {
    try {
      const { streamText } = await import("ai");
      const { createOpenAI } = await import("@ai-sdk/openai");

      // 验证消息格式
      if (!messages || messages.length === 0) {
        throw new Error("消息不能为空");
      }

      // 创建AbortController用于中断
      const abortController = new AbortController();
      const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 保存到映射中，用于后续中断
      AIService.streamControllers.set(streamId, abortController);

      const openai = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL
      });

      const result = await streamText({
        model: openai.chat(config.model),
        messages: messages,
        temperature: config.temperature,
        abortSignal: abortController.signal
      });

      // 异步处理流式响应
      (async () => {
        try {
          let fullContent = "";
          for await (const delta of result.textStream) {
            fullContent += delta;
            // 发送累积内容到渲染进程
            event.sender.send(`ai:stream-chunk:${streamId}`, {
              type: "chunk",
              content: fullContent // 发送累积内容而不是增量
            });
          }

          // 流结束信号
          event.sender.send(`ai:stream-chunk:${streamId}`, {
            type: "end",
            usage: await result.usage
          });
        } catch (streamError) {
          // 流错误信号
          event.sender.send(`ai:stream-chunk:${streamId}`, {
            type: "error",
            error: streamError instanceof Error ? streamError.message : String(streamError)
          });
        } finally {
          // 清理AbortController
          AIService.streamControllers.delete(streamId);
        }
      })();

      // 立即返回流ID，让渲染进程开始监听
      return {
        success: true,
        data: {
          streamId,
          model: config.model
        },
        timestamp: Date.now()
      };
    } catch (error) {
      // 统一错误处理
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          throw new Error("API 密钥无效，请检查配置");
        }
        if (error.message.includes("timeout") || error.message.includes("网络")) {
          throw new Error("网络连接超时，请重试");
        }
        if (error.message.includes("quota") || error.message.includes("limit")) {
          throw new Error("API 配额不足，请检查账户余额");
        }

        return {
          success: false,
          data: null,
          message: `AI 流式调用失败: ${error.message}`,
          timestamp: Date.now()
        };
      }

      return {
        success: false,
        data: null,
        message: `AI 流式调用失败: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * 中断流式聊天
   */
  async abortStream(streamId: string): Promise<{ success: boolean; streamId?: string; error?: string }> {
    try {
      const controller = AIService.streamControllers.get(streamId);
      if (controller) {
        controller.abort();
        AIService.streamControllers.delete(streamId);
        return { success: true, streamId };
      } else {
        return { success: false, error: "流式聊天不存在或已结束" };
      }
    } catch (error) {
      throw new Error(`中断流式聊天失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 注册AI相关的 IPC 处理器
   */
  registerAIHandlers(): void {
    // AI 聊天
    registerHandler(IPC_CHANNELS.AI.CHAT, async (config: AIConfig, messages: AIMessage[]) => {
      return await this.chat(config, messages);
    });

    // AI 流式聊天 (直接使用 ipcMain.handle 来访问 event 对象)
    ipcMain.handle(
      IPC_CHANNELS.AI.CHAT_STREAM,
      async (event: Electron.IpcMainInvokeEvent, config: AIConfig, messages: AIMessage[]) => {
        return await this.chatStream(event, config, messages);
      }
    );

    // AI 中断流式聊天
    registerHandler(IPC_CHANNELS.AI.ABORT_STREAM, async (streamId: string) => {
      return await this.abortStream(streamId);
    });
  }
}
