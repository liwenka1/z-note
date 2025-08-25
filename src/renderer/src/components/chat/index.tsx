import { motion } from "framer-motion";
import { ChatHeader } from "./components/chat-header";
import { ChatMessageList } from "./components/chat-message-list";
import { ChatInput } from "./components/chat-input";
import { EmptyChat } from "./components/empty-chat";
import { useChatState } from "./hooks/use-chat-state";
import { CHAT_ANIMATION, CHAT_CLASSES } from "./constants/chat";

/**
 * Chat 主组件
 * 参考 root-layout 的模式，组合所有子组件
 */
export function ChatPanel() {
  const { currentSession, hasMessages } = useChatState();

  return (
    <motion.div {...CHAT_ANIMATION} className={CHAT_CLASSES.PANEL}>
      <ChatHeader />

      <div className={CHAT_CLASSES.CONTENT}>{hasMessages ? <ChatMessageList /> : <EmptyChat />}</div>

      <ChatInput />
    </motion.div>
  );
}
