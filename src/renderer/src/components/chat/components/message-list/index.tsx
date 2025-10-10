import { useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageItem } from "./components/message-item";
import { EmptyChat } from "../empty-chat";
import { useChatStore } from "@renderer/stores/chat-store";

export function ChatMessageList() {
  // 直接订阅 store 的状态变化
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });

  // 使用 useMemo 稳定 messages 引用
  const messages = useMemo(() => {
    return currentSession?.messages || [];
  }, [currentSession?.messages]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 检测是否有正在流式输出的消息
  const hasStreamingMessage = useMemo(() => {
    return messages.some((msg) => msg.isStreaming);
  }, [messages]);

  // 创建消息内容哈希，用于检测内容变化
  const messagesContentHash = useMemo(() => {
    return messages.map((msg) => `${msg.id}-${msg.content.length}-${msg.isStreaming || false}`).join("|");
  }, [messages]);

  // 监听消息数量变化（用户发送消息时滚动到底部）
  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
      // 检查是否有用户消息被添加
      const userMessages = messages.filter((msg) => msg.role === "user");
      const assistantMessages = messages.filter((msg) => msg.role === "assistant");

      // 如果用户消息和AI消息数量相等，说明刚发送了新消息
      if (userMessages.length === assistantMessages.length && userMessages.length > 0) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // 监听消息内容变化（流式输出时跟随滚动）
  useEffect(() => {
    if (hasStreamingMessage && scrollRef.current) {
      // 流式输出时跟随内容变化滚动，使用快速无动画滚动
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messagesContentHash, hasStreamingMessage]);

  // 如果没有消息，显示空状态
  if (messages.length === 0) {
    return <EmptyChat />;
  }

  return (
    <div ref={scrollRef} className="h-full overflow-x-hidden overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index === messages.length - 1 ? 0 : 0
            }}
          >
            <MessageItem message={message} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
