import { create } from "zustand";
import { chatsApi } from "@renderer/api/chats";
import { tagsApi } from "@renderer/api/tags";
import type { Chat, ChatFormData, TagFormData } from "@renderer/types";

// 消息类型 - 对应数据库中的Chat记录
export interface Message {
  id: string; // 对应Chat.id (转换为字符串)
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date; // 对应Chat.createdAt
  isLoading?: boolean;
  isStreaming?: boolean;
  error?: string;
}

// 会话类型 - 对应数据库中的Tag + 该Tag下的Chat记录
export interface ChatSession {
  id: string; // 对应Tag.id (转换为字符串)
  tagId: number; // 对应数据库中的Tag.id
  title: string; // 对应Tag.name
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isTyping: boolean;
  isLoading: boolean; // 新增：用于异步操作状态

  // Actions
  loadSessions: () => Promise<void>;
  createSession: () => Promise<string>;
  deleteSession: (id: string) => Promise<void>;
  setCurrentSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, "id" | "timestamp">) => Promise<string>;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => Promise<void>;
  deleteMessage: (sessionId: string, messageId: string) => Promise<void>;
  clearSession: (sessionId: string) => Promise<void>;
  getCurrentSession: () => ChatSession | null;
  setIsTyping: (isTyping: boolean) => void;
}

// 数据转换工具
const convertChatToMessage = (chat: Chat, extraProps?: Partial<Message>): Message => ({
  id: `msg_${chat.id}`,
  role: chat.role as "user" | "assistant" | "system",
  content: chat.content || "",
  timestamp: new Date(chat.createdAt),
  ...extraProps // 允许传递额外的属性，如 isLoading, isStreaming
});

const convertMessageToChat = (
  message: Omit<Message, "id" | "timestamp" | "isLoading" | "isStreaming" | "error">,
  tagId: number
): ChatFormData => ({
  tagId,
  content: message.content,
  role: message.role as "user" | "assistant" | "system",
  type: "chat" as const,
  inserted: false
});

export const useChatStore = create<ChatState>()((set, get) => ({
  sessions: [],
  currentSessionId: null,
  isTyping: false,
  isLoading: false,

  loadSessions: async () => {
    try {
      set({ isLoading: true });

      // 获取所有标签
      const allTags = await tagsApi.getAll();
      // 过滤出聊天相关的标签（名称以chat_开头的标签）
      const chatTags = allTags?.filter((tag) => tag.name.startsWith("chat_")) || [];

      const sessions: ChatSession[] = [];

      // 为每个聊天标签加载对应的聊天记录
      for (const tag of chatTags) {
        const chats = await chatsApi.getByTag(tag.id);
        const messages = chats.map((chat) => convertChatToMessage(chat));

        // 确定会话标题：优先使用第一条用户消息，否则使用默认格式
        const firstUserMessage = messages.find((msg) => msg.role === "user");
        const title = firstUserMessage
          ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
          : tag.name.replace("chat_", "") || `会话 ${tag.id}`;

        sessions.push({
          id: `chat_${tag.id}`,
          tagId: tag.id,
          title,
          messages,
          createdAt: new Date(), // 可以考虑从tag或第一条消息获取
          updatedAt: new Date()
        });
      }

      set({ sessions, isLoading: false });
    } catch (error) {
      console.error("加载会话失败:", error);
      set({ isLoading: false });
    }
  },

  createSession: async () => {
    try {
      set({ isLoading: true });

      const timestamp = Date.now();
      const tagName = `chat_${timestamp}`;

      // 1. 创建新标签
      const newTag = await tagsApi.create({
        name: tagName,
        isLocked: false,
        isPin: false
      } as TagFormData);

      // 2. 创建会话对象
      const newSession: ChatSession = {
        id: `chat_${newTag.id}`,
        tagId: newTag.id,
        title: newTag.name.replace("chat_", "") || `会话 ${newTag.id}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set((state) => ({
        sessions: [newSession, ...state.sessions],
        currentSessionId: newSession.id,
        isLoading: false
      }));

      return newSession.id;
    } catch (error) {
      console.error("创建会话失败:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      const tagId = parseInt(sessionId.replace("chat_", ""));
      await tagsApi.delete(tagId); // 删除标签，会级联删除聊天记录

      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== sessionId),
        currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
      }));
    } catch (error) {
      console.error("删除会话失败:", error);
      throw error;
    }
  },

  setCurrentSession: (sessionId: string) => {
    set({ currentSessionId: sessionId });
  },

  addMessage: async (sessionId: string, message: Omit<Message, "id" | "timestamp">) => {
    try {
      const tagId = parseInt(sessionId.replace("chat_", ""));

      // 分离UI状态和数据库数据
      const { isLoading, isStreaming, error, ...messageForDB } = message;
      const chatFormData = convertMessageToChat(messageForDB, tagId);
      const newChat = await chatsApi.create(chatFormData);

      // 从数据库记录创建消息，并保留UI状态
      const newMessage = convertChatToMessage(newChat, {
        isLoading: message.isLoading,
        isStreaming: message.isStreaming,
        error: message.error
      });

      // 如果是第一条用户消息，需要更新标题并同步到数据库
      let newTitle: string | undefined;
      const currentSession = get().sessions.find((s) => s.id === sessionId);
      if (currentSession && currentSession.messages.length === 0 && message.role === "user") {
        newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");

        // 同步更新数据库中的Tag名称
        try {
          await tagsApi.update(tagId, { name: `chat_${newTitle}` });
        } catch (error) {
          console.error("更新标签名称失败:", error);
        }
      }

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, newMessage],
                updatedAt: new Date(),
                title: newTitle || session.title
              }
            : session
        )
      }));

      return newMessage.id;
    } catch (error) {
      console.error("添加消息失败:", error);
      throw error;
    }
  },

  updateMessage: async (sessionId: string, messageId: string, updates: Partial<Message>) => {
    try {
      const chatId = parseInt(messageId.replace("msg_", ""));
      await chatsApi.update(chatId, { content: updates.content });

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: session.messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg)),
                updatedAt: new Date()
              }
            : session
        )
      }));
    } catch (error) {
      console.error("更新消息失败:", error);
      throw error;
    }
  },

  deleteMessage: async (sessionId: string, messageId: string) => {
    try {
      const chatId = parseInt(messageId.replace("msg_", ""));
      await chatsApi.delete(chatId);

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: session.messages.filter((msg) => msg.id !== messageId),
                updatedAt: new Date()
              }
            : session
        )
      }));
    } catch (error) {
      console.error("删除消息失败:", error);
      throw error;
    }
  },

  clearSession: async (sessionId: string) => {
    try {
      const tagId = parseInt(sessionId.replace("chat_", ""));
      await chatsApi.clearByTag(tagId);

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [],
                updatedAt: new Date()
              }
            : session
        )
      }));
    } catch (error) {
      console.error("清空会话失败:", error);
      throw error;
    }
  },

  getCurrentSession: () => {
    const { sessions, currentSessionId } = get();
    return sessions.find((s) => s.id === currentSessionId) || null;
  },

  setIsTyping: (isTyping: boolean) => {
    set({ isTyping });
  }
}));
