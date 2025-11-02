import { useEffect } from "react";
import { ChatHeader } from "./header";
import { ChatMessageList } from "./messages";
import { ChatInput } from "./input";
import { useChatStore } from "@renderer/stores";

/**
 * Chat 主组件 - 简洁版本，参考 Cursor 设计
 */
export function ChatPanel() {
  const { loadSessions } = useChatStore();

  // 组件初始化时加载会话数据
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <div className="min-h-0 flex-1">
        <ChatMessageList />
      </div>

      <ChatInput />
    </div>
  );
}
