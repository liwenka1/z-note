import { useState, useEffect } from "react";
import { useChatStore, useAIConfigStore, usePromptStore, useChatTagStore } from "@renderer/stores";
import { useStreamingChat } from "@renderer/hooks";
import { useMarksByTag } from "@renderer/hooks/queries";
import { buildAIRequestContent } from "@renderer/lib/tag-context";
import { ConfigSelector } from "./config-selector";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit
} from "@renderer/components/ai-elements/prompt-input";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { configs, currentConfig, getCurrentConfig, setDefaultConfig } = useAIConfigStore();
  const { currentPrompt } = usePromptStore();

  // 标签关联相关
  const { currentAssociatedTagId } = useChatTagStore();
  const { data: marks } = useMarksByTag(currentAssociatedTagId || 0, !!currentAssociatedTagId);

  // 获取当前选中的配置
  const selectedConfig = currentConfig || getCurrentConfig();

  const { addMessage, createSession, updateMessage } = useChatStore();
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });
  const isTyping = useChatStore((state) => state.isTyping);

  // 准备上下文消息：将会话中的消息转换为AI API格式
  const contextMessages = (() => {
    const messages =
      currentSession?.messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      })) || [];

    // 如果有当前选中的 prompt，将其作为 system 消息添加到消息列表的开头
    if (currentPrompt && currentPrompt.content.trim()) {
      // 检查是否已经有 system 消息，如果有则替换，否则添加
      const hasSystemMessage = messages.some((msg) => msg.role === "system");

      if (hasSystemMessage) {
        // 替换第一个 system 消息
        const systemIndex = messages.findIndex((msg) => msg.role === "system");
        if (systemIndex !== -1) {
          messages[systemIndex] = {
            role: "system",
            content: currentPrompt.content
          };
        }
      } else {
        // 在开头添加 system 消息
        messages.unshift({
          role: "system",
          content: currentPrompt.content
        });
      }
    }

    return messages;
  })();

  // 流式AI Chat Hook
  const streamingChatResult = useStreamingChat({
    config: selectedConfig || {
      id: "temp",
      name: "temp",
      provider: "openai",
      apiKey: "",
      baseURL: "",
      model: "",
      temperature: 0.7,
      maxTokens: 1000,
      isDefault: false
    },
    contextMessages, // 传递完整的对话上下文
    onMessageAdd: async (message) => {
      let sessionId = currentSession?.id;
      if (!sessionId) {
        sessionId = await createSession();
      }

      // 🎯 跳过用户消息的添加，因为我们已经手动添加了
      if (message.role === "user") {
        return ""; // 返回空字符串，表示跳过
      }

      const messageId = await addMessage(sessionId, {
        ...message,
        isStreaming: message.isStreaming,
        isLoading: message.isStreaming
      });

      return messageId;
    },
    onMessageUpdate: async (messageId, content) => {
      const sessionId = currentSession?.id;
      if (sessionId) {
        await updateMessage(sessionId, messageId, { content, isStreaming: true });
      }
    },
    onMessageComplete: async (messageId) => {
      const sessionId = currentSession?.id;
      if (sessionId) {
        await updateMessage(sessionId, messageId, { isStreaming: false, isLoading: false });
      }
    }
  });

  const { sendMessage: sendAIMessage, isLoading: isAILoading, stop: stopStreaming } = streamingChatResult;

  // 设置默认配置
  useEffect(() => {
    if (configs.length > 0 && !currentConfig) {
      const defaultConfig = getCurrentConfig();
      if (defaultConfig) {
        setDefaultConfig(defaultConfig.id);
      }
    }
  }, [configs, getCurrentConfig, currentConfig, setDefaultConfig]);

  // 🎯 核心函数：发送消息给AI，在这里处理标签上下文
  const sendMessageToAI = async (userInput: string) => {
    // 构建包含标签上下文的消息（如果有关联标签）
    const messageToAI = buildAIRequestContent(userInput, marks);

    // 🔥 关键：发送包含标签上下文的消息给AI
    sendAIMessage(messageToAI);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || isAILoading || !selectedConfig) return;

    const userInput = input.trim();

    // 确保有活动会话
    let sessionId = currentSession?.id;
    if (!sessionId) {
      sessionId = await createSession();
    }

    // 如果是新会话且有当前选中的 prompt，先添加 system 消息
    if (currentPrompt && currentPrompt.content.trim() && currentSession?.messages.length === 0) {
      await addMessage(sessionId, {
        role: "system",
        content: currentPrompt.content,
        isStreaming: false,
        isLoading: false
      });
    }

    // 🎯 新架构：先添加用户消息（显示原始问题），然后发送给AI
    await addMessage(sessionId, {
      role: "user",
      content: userInput, // 用户看到原始问题
      isStreaming: false,
      isLoading: false
    });

    // 发送给AI（可能包含标签上下文）
    await sendMessageToAI(userInput);
    setInput("");
  };

  const handleStop = () => {
    if (isAILoading) {
      stopStreaming();
    }
  };

  return (
    <div className="p-4">
      <PromptInput
        className="w-full"
        onSubmit={(message) => {
          if (message.text) {
            handleSend();
          }
        }}
      >
        <PromptInputBody>
          {/* 主要输入区域 */}
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || isAILoading}
            placeholder={isTyping || isAILoading ? "AI 正在回复中..." : "输入消息..."}
            className="max-h-[200px] min-h-[80px]"
          />
        </PromptInputBody>

        {/* 底部操作栏 */}
        <PromptInputFooter>
          {/* 左侧工具：AI 配置选择器 */}
          <PromptInputTools>
            <ConfigSelector
              configs={configs}
              selectedConfigId={currentConfig?.id || ""}
              selectedConfig={selectedConfig}
              onConfigChange={(configId) => setDefaultConfig(configId)}
              disabled={isTyping || isAILoading}
            />
          </PromptInputTools>

          {/* 右侧：发送/停止按钮 */}
          <PromptInputSubmit
            status={isAILoading ? "streaming" : undefined}
            disabled={!input.trim()}
            onClick={(e) => {
              if (isAILoading) {
                e.preventDefault();
                handleStop();
              }
            }}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
