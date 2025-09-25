import { useCallback, useRef, useState, useEffect } from "react";
import { type AIConfig } from "@renderer/stores/ai-config-store";
import { AIService, type StreamChunk, type ChatMessage } from "@renderer/api/ai";
import { ErrorHandler } from "@renderer/lib/error-handler";
import { ipcClient, handleResponse } from "@renderer/api/ipc";
import { IPC_CHANNELS } from "@shared/ipc-channels";

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UseStreamingChatReturn {
  messages: UIMessage[];
  sendMessage: (message: string) => void;
  setMessages: (messages: UIMessage[]) => void;
  stop: () => void;
  status: "ready" | "streaming" | "submitting" | "error";
  isLoading: boolean;
}

interface UseStreamingChatOptions {
  config: AIConfig;
  onMessageAdd?: (message: { role: "user" | "assistant"; content: string; isStreaming?: boolean }) => string | void;
  onMessageUpdate?: (messageId: string, content: string) => void;
  onMessageComplete?: (messageId: string) => void;
}

/**
 * 自定义流式聊天Hook
 * 基于AI SDK的streamText和现有IPC架构实现
 */
export function useStreamingChat({
  config,
  onMessageAdd,
  onMessageUpdate,
  onMessageComplete
}: UseStreamingChatOptions): UseStreamingChatReturn {
  const messagesRef = useRef<ChatMessage[]>([]);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<"ready" | "streaming" | "submitting" | "error">("ready");
  const cleanupRef = useRef<(() => void) | null>(null);
  const currentStreamIdRef = useRef<string | null>(null);
  const currentAssistantMessageIdRef = useRef<string | null>(null);
  const onMessageAddRef = useRef(onMessageAdd);
  const onMessageUpdateRef = useRef(onMessageUpdate);
  const onMessageCompleteRef = useRef(onMessageComplete);

  // 更新refs
  useEffect(() => {
    onMessageAddRef.current = onMessageAdd;
    onMessageUpdateRef.current = onMessageUpdate;
    onMessageCompleteRef.current = onMessageComplete;
  });

  // 清理函数
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!config || !config.apiKey || status === "streaming" || status === "submitting") {
        return;
      }

      if (!userMessage.trim()) return;

      setStatus("submitting");

      try {
        // 添加用户消息到内部状态
        const userChatMessage: ChatMessage = {
          role: "user",
          content: userMessage.trim()
        };
        const updatedMessages = [...messagesRef.current, userChatMessage];
        messagesRef.current = updatedMessages;

        // 添加UI消息
        const userUIMessage: UIMessage = {
          id: `user_${Date.now()}`,
          role: "user",
          content: userMessage.trim()
        };

        const assistantUIMessage: UIMessage = {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: ""
        };

        setMessages((prev) => [...prev, userUIMessage, assistantUIMessage]);

        // 如果有外部的消息添加回调，也调用它
        if (onMessageAddRef.current) {
          onMessageAddRef.current({ role: "user", content: userMessage.trim() });
          // 获取真实的assistant消息ID
          const realAssistantMessageId = onMessageAddRef.current({
            role: "assistant",
            content: "",
            isStreaming: true
          });

          // 保存真实的ID用于后续更新
          if (typeof realAssistantMessageId === "string") {
            currentAssistantMessageIdRef.current = realAssistantMessageId;
          }
        }

        setStatus("streaming");

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
          updatedMessages
        );

        const streamResponse = handleResponse(response) as { streamId: string; model: string };
        const { streamId } = streamResponse;
        currentStreamIdRef.current = streamId;

        // 监听流式数据
        const cleanup = ipcClient.on(`ai:stream-chunk:${streamId}`, (chunk: unknown) => {
          const streamChunk = chunk as StreamChunk;
          switch (streamChunk.type) {
            case "chunk":
              if (streamChunk.content) {
                // 更新UI消息内容（累积内容）
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === "assistant") {
                    lastMessage.content = streamChunk.content!; // 直接设置累积内容

                    // 立即更新全局存储
                    if (onMessageUpdateRef.current && currentAssistantMessageIdRef.current) {
                      onMessageUpdateRef.current(currentAssistantMessageIdRef.current, streamChunk.content!);
                    }
                  }
                  return newMessages;
                });
              }
              break;
            case "end":
              setStatus("ready");
              currentStreamIdRef.current = null;

              // 将最终的AI响应添加到内部消息历史
              setMessages((current) => {
                const lastMessage = current[current.length - 1];
                if (lastMessage && lastMessage.role === "assistant") {
                  const aiMsgForAPI: ChatMessage = {
                    role: "assistant",
                    content: lastMessage.content
                  };
                  messagesRef.current = [...messagesRef.current, aiMsgForAPI];

                  // 通知完成
                  if (onMessageCompleteRef.current && currentAssistantMessageIdRef.current) {
                    onMessageCompleteRef.current(currentAssistantMessageIdRef.current);
                  }
                }
                return current;
              });

              // 先重置状态，再清理监听器
              currentAssistantMessageIdRef.current = null;
              cleanup(); // 自动清理监听器
              break;
            case "error":
              setStatus("error");
              currentStreamIdRef.current = null;
              currentAssistantMessageIdRef.current = null;

              // 移除错误的消息
              messagesRef.current = messagesRef.current.slice(0, -1);
              setMessages((prev) => prev.slice(0, -2)); // 移除用户消息和AI消息

              ErrorHandler.handle(new Error(streamChunk.error || "未知错误"), "AI 流式聊天");
              cleanup(); // 自动清理监听器
              break;
          }
        });

        cleanupRef.current = cleanup;
      } catch (error) {
        setStatus("error");
        messagesRef.current = messagesRef.current.slice(0, -1);
        setMessages((prev) => prev.slice(0, -1));
        ErrorHandler.handle(error, "AI 流式聊天");
      }
    },
    [config, status]
  );

  const stop = useCallback(async () => {
    // 如果有活动的流，通过IPC中断它
    if (currentStreamIdRef.current) {
      await AIService.abortStream(currentStreamIdRef.current);

      currentStreamIdRef.current = null;
      currentAssistantMessageIdRef.current = null;
    }

    // 清理监听器
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    setStatus("ready");
  }, []);

  const setMessagesCallback = useCallback((newMessages: UIMessage[]) => {
    setMessages(newMessages);
    // 同步更新内部消息历史
    messagesRef.current = newMessages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    }));
  }, []);

  return {
    messages,
    sendMessage,
    setMessages: setMessagesCallback,
    stop,
    status,
    isLoading: status === "streaming" || status === "submitting"
  };
}
