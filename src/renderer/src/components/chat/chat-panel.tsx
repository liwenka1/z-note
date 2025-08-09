import { motion } from "framer-motion";
import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { EmptyChat } from "./empty-chat";
import { useChatStore } from "@renderer/store/chat-store";

export function ChatPanel() {
  const { getCurrentSession } = useChatStore();
  const currentSession = getCurrentSession();
  const hasMessages = currentSession && currentSession.messages.length > 0;

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
