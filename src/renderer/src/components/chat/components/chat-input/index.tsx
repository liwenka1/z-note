import { useState, useEffect } from "react";
import { useChatStore } from "@renderer/stores/chat-store";
import { useAIConfigStore } from "@renderer/stores/ai-config-store";
import { useChatTagStore } from "@renderer/stores/chat-tag-store";
import { useStreamingChat } from "@renderer/hooks";
import { useMarksByTag } from "@renderer/hooks/queries";
import { ConfigSelector } from "./components/config-selector";
import { InputArea } from "./components/input-area";
import { InputControls } from "./components/input-controls";
import type { Mark } from "@renderer/types";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const { configs, currentConfig, getCurrentConfig, setDefaultConfig } = useAIConfigStore();

  // 标签关联相关
  const { currentAssociatedTagId } = useChatTagStore();
  const { data: marks } = useMarksByTag(currentAssociatedTagId || 0, !!currentAssociatedTagId);

  // 工具函数：按类型分类 marks
  const categorizeMarks = (marks: Mark[]) => {
    return {
      scan: marks.filter((item) => item.type === "scan"),
      text: marks.filter((item) => item.type === "text"),
      image: marks.filter((item) => item.type === "image"),
      link: marks.filter((item) => item.type === "link"),
      file: marks.filter((item) => item.type === "file")
    };
  };

  // 工具函数：构建单个类型的内容
  const buildTypeContent = (marks: Mark[], type: "scan" | "text" | "image" | "link" | "file") => {
    if (marks.length === 0) return "";

    return marks
      .map((item, index) => {
        let content = "";
        switch (type) {
          case "scan":
          case "text":
          case "file":
            content = item.content || "";
            break;
          case "image":
            content = item.desc || item.content || "";
            break;
          case "link":
            content = item.desc || item.url || "";
            break;
        }
        return `${index + 1}. ${content}`;
      })
      .join(";\n\n");
  };

  // 工具函数：构建标签上下文内容
  const buildTagContext = (marks: Mark[]) => {
    const categorized = categorizeMarks(marks);

    const scanContent = buildTypeContent(categorized.scan, "scan");
    const textContent = buildTypeContent(categorized.text, "text");
    const imageContent = buildTypeContent(categorized.image, "image");
    const linkContent = buildTypeContent(categorized.link, "link");
    const fileContent = buildTypeContent(categorized.file, "file");

    return `可以参考以下内容笔记的记录：
以下是通过截图后，使用OCR识别出的文字片段：
${scanContent}。
以下是通过文本复制记录的片段：
${textContent}。
以下是图片记录：
${imageContent}。
以下是链接记录：
${linkContent}。
以下是文件记录：
${fileContent}。

`;
  };

  // 获取当前选中的配置
  const selectedConfig = currentConfig || getCurrentConfig();

  const { addMessage, createSession, updateMessage } = useChatStore();
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });
  const isTyping = useChatStore((state) => state.isTyping);

  // 准备上下文消息：将会话中的消息转换为AI API格式
  const contextMessages =
    currentSession?.messages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
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
    // 如果关联了标签，构建包含标签上下文的消息
    let messageToAI = userInput;
    if (currentAssociatedTagId && marks && marks.length > 0) {
      const tagContext = buildTagContext(marks);
      messageToAI = `${tagContext}${userInput}`; // AI收到包含上下文的完整内容
    }

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
              selectedConfigId={currentConfig?.id || ""}
              selectedConfig={selectedConfig}
              onConfigChange={(configId) => setDefaultConfig(configId)}
              disabled={isTyping || isAILoading}
            />

            {/* 右侧：发送/停止按钮 */}
            <InputControls canSend={!!input.trim()} isAILoading={isAILoading} onSend={handleSend} onStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  );
}
