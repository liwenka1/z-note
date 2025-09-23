import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageItem } from "./message-item";
import { useChatStore } from "@renderer/stores/chat-store";

export function ChatMessageList() {
  // 直接订阅 store 的状态变化，而不是使用 getCurrentSession
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });
  const messages = currentSession?.messages || [];

  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部（新消息时）
  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
      // 使用 requestAnimationFrame 确保 DOM 更新完成后再滚动
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
          });
        }
      });
    }
  }, [messages.length]);

  return (
    <div ref={scrollRef} className="h-full overflow-x-hidden overflow-y-auto scroll-smooth p-4">
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
