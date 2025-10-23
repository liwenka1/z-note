import { useChatStore } from "@renderer/stores";

/**
 * Chat 状态管理 Hook
 * 封装与 useChatStore 的交互，提供简化的接口
 */
export function useChatState() {
  // 直接订阅 store 的状态变化
  const currentSession = useChatStore((state) => {
    const current = state.sessions.find((s) => s.id === state.currentSessionId);
    return current || null;
  });

  const hasMessages = currentSession && currentSession.messages.length > 0;
  const isTyping = useChatStore((state) => state.isTyping);

  return {
    // 状态
    currentSession,
    hasMessages,
    isTyping
  };
}
