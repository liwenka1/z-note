import { motion } from "framer-motion";
import { ChatHeader } from "./components/chat-header";
import { ChatMessageList } from "./components/chat-message-list";
import { ChatInput } from "./components/chat-input";
import { EmptyChat } from "./components/empty-chat";
import { useChatState } from "./hooks/use-chat-state";

/**
 * Chat 主组件
 * 参考 root-layout 的模式，组合所有子组件
 */
export function ChatPanel() {
  const { hasMessages } = useChatState();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-background flex h-full flex-col"
    >
      <ChatHeader />

      <div className="flex-1 overflow-hidden">{hasMessages ? <ChatMessageList /> : <EmptyChat />}</div>

      <ChatInput />
    </motion.div>
  );
}
