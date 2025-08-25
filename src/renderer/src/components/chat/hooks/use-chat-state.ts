import { useChatStore } from "@renderer/store/chat-store";

/**
 * Chat 状态管理 Hook
 * 封装与 useChatStore 的交互，提供简化的接口
 * 参考 root-layout 的 use-layout-state.ts
 */
export function useChatState() {
  const { getCurrentSession } = useChatStore();
  const currentSession = getCurrentSession();
  const hasMessages = currentSession && currentSession.messages.length > 0;

  return {
    // 状态
    currentSession,
    hasMessages
  };
}
