import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isTyping: boolean;

  // Actions
  createSession: () => string;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, "id" | "timestamp">) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;
  clearSession: (sessionId: string) => void;
  getCurrentSession: () => ChatSession | null;
}

// Mock 数据生成器
const mockResponses = [
  "我理解您的问题。让我来帮您分析一下...",
  "这是一个很好的问题。根据我的理解，可以从以下几个方面来看：",
  "我可以为您提供以下几种解决方案：\n\n1. **方案一**：简单直接的方法\n2. **方案二**：更高级的实现方式\n3. **方案三**：最佳实践推荐",
  "让我为您详细解释一下这个概念：",
  "根据您的描述，我建议您可以尝试以下步骤："
];

const generateMockResponse = (userInput: string): string => {
  if (userInput.includes("代码") || userInput.includes("code")) {
    return "```javascript\n// 这是一个示例代码\nconst example = () => {\n  console.log('Hello World!');\n  return 'Success';\n}\n\nexample();\n```\n\n这段代码展示了基本的函数定义和调用方法。";
  }

  if (userInput.includes("帮助") || userInput.includes("help")) {
    return "我很乐意为您提供帮助！我可以协助您：\n\n- 📝 分析和总结文档内容\n- 💻 编写和优化代码\n- 🤔 回答技术问题\n- 📋 制定计划和方案\n\n请告诉我您具体需要什么帮助。";
  }

  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isTyping: false,

      createSession: () => {
        const newSession: ChatSession = {
          id: `session_${Date.now()}`,
          title: `新对话 ${new Date().toLocaleDateString()}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id
        }));

        return newSession.id;
      },

      deleteSession: (id: string) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId:
            state.currentSessionId === id ? state.sessions.find((s) => s.id !== id)?.id || null : state.currentSessionId
        }));
      },

      setCurrentSession: (id: string) => {
        set({ currentSessionId: id });
      },

      addMessage: (sessionId: string, message: Omit<Message, "id" | "timestamp">) => {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  updatedAt: new Date(),
                  // 如果是第一条用户消息，更新会话标题
                  title:
                    session.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                      : session.title
                }
              : session
          )
        }));

        // 如果是用户消息，自动生成 AI 回复
        if (message.role === "user") {
          // 先设置 typing 状态
          set({ isTyping: true });

          // 添加加载中的 AI 消息
          const loadingMessage: Message = {
            id: `msg_loading_${Date.now()}`,
            role: "assistant",
            content: "",
            timestamp: new Date(),
            isLoading: true
          };

          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: [...session.messages, loadingMessage],
                    updatedAt: new Date()
                  }
                : session
            )
          }));

          // 模拟 AI 回复延迟
          setTimeout(
            () => {
              const aiResponse = generateMockResponse(message.content);

              set((state) => ({
                sessions: state.sessions.map((session) =>
                  session.id === sessionId
                    ? {
                        ...session,
                        messages: session.messages.map((msg) =>
                          msg.id === loadingMessage.id ? { ...msg, content: aiResponse, isLoading: false } : msg
                        ),
                        updatedAt: new Date()
                      }
                    : session
                ),
                isTyping: false
              }));
            },
            1000 + Math.random() * 2000
          ); // 1-3秒随机延迟
        }
      },

      updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => {
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
      },

      deleteMessage: (sessionId: string, messageId: string) => {
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
      },

      clearSession: (sessionId: string) => {
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
      },

      getCurrentSession: () => {
        const state = get();
        return state.sessions.find((s) => s.id === state.currentSessionId) || null;
      }
    }),
    {
      name: "chat-storage",
      // 只持久化基本数据，不持久化临时状态
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId
      })
    }
  )
);
