import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageItem } from "./message-item";
import { useChatStore } from "@renderer/store/chat-store";

export function ChatMessageList() {
  const { getCurrentSession } = useChatStore();
  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部（新消息时）
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    return;
  }, [messages.length]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto scroll-smooth p-4">
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
