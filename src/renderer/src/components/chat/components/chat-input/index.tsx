import { useState, useEffect } from "react";
import { useChatStore } from "@renderer/stores/chat-store";
import { useAIConfigStore } from "@renderer/stores/ai-config-store";
import { useStreamingChat } from "@renderer/hooks";
import { ConfigSelector } from "./components/config-selector";
import { InputArea } from "./components/input-area";
import { InputControls } from "./components/input-controls";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // AI 配置相关
  const { configs, getCurrentConfig } = useAIConfigStore();
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");

  // 获取当前选中的配置
  const selectedConfig = configs.find((c) => c.id === selectedConfigId) || getCurrentConfig();

  const { addMessage, createSession, updateMessage } = useChatStore();
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });
  const isTyping = useChatStore((state) => state.isTyping);

  // 准备上下文消息：将会话中的消息转换为AI API格式
  const contextMessages =
    currentSession?.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    })) || [];

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
    onMessageAdd: (message) => {
      let sessionId = currentSession?.id;
      if (!sessionId) {
        sessionId = createSession();
      }

      const messageId = addMessage(sessionId, message);

      if (message.role === "assistant") {
        return messageId;
      }

      return undefined;
    },
    onMessageUpdate: (messageId, content) => {
      const sessionId = currentSession?.id;
      if (sessionId) {
        updateMessage(sessionId, messageId, { content, isStreaming: true });
      }
    },
    onMessageComplete: (messageId) => {
      const sessionId = currentSession?.id;
      if (sessionId) {
        updateMessage(sessionId, messageId, { isStreaming: false });
      }
    }
  });

  const {
    sendMessage: sendAIMessage,
    isLoading: isAILoading,
    setMessages: setAIMessages,
    stop: stopStreaming
  } = streamingChatResult;

  // 当切换会话时同步会话消息到AI Chat Hook
  useEffect(() => {
    // 将当前会话的消息转换为UI消息格式
    const uiMessages =
      currentSession?.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content
      })) || [];

    setAIMessages(uiMessages);
  }, [currentSession?.id, currentSession?.messages, setAIMessages]);

  // 初始化默认配置
  useEffect(() => {
    if (!selectedConfigId && configs.length > 0) {
      const defaultConfig = getCurrentConfig();
      if (defaultConfig) {
        setSelectedConfigId(defaultConfig.id);
      }
    }
  }, [configs, getCurrentConfig, selectedConfigId]);

  const handleSend = () => {
    if (!input.trim() || isTyping || isAILoading || !selectedConfig) return;

    // 确保有活动会话
    let sessionId = currentSession?.id;
    if (!sessionId) {
      sessionId = createSession();
    }

    // 使用流式AI Chat Hook发送消息
    sendAIMessage(input.trim());
    setInput("");
  };

  const handleStop = () => {
    if (isAILoading) {
      stopStreaming();
    }
  };

  const canSend = Boolean(input.trim() && !isTyping && !isAILoading && selectedConfig);

  return (
    <div className="p-4">
      <div className="w-full">
        <div className="bg-background relative rounded-xl border shadow-sm">
          {/* 主要输入区域 */}
          <InputArea
            input={input}
            setInput={setInput}
            isComposing={isComposing}
            setIsComposing={setIsComposing}
            onSend={handleSend}
            disabled={isTyping || isAILoading}
            placeholder={isTyping || isAILoading ? "AI 正在回复中..." : "输入消息..."}
          />

          {/* 底部操作栏 */}
          <div className="bg-background flex items-center justify-between rounded-b-xl border-t p-3">
            {/* 左侧：AI 配置选择器 */}
            <ConfigSelector
              configs={configs}
              selectedConfigId={selectedConfigId}
              selectedConfig={selectedConfig}
              onConfigChange={setSelectedConfigId}
              disabled={isTyping || isAILoading}
            />

            {/* 右侧：发送/停止按钮 */}
            <InputControls canSend={canSend} isAILoading={isAILoading} onSend={handleSend} onStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  );
}
