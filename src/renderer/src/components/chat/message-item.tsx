import { motion } from "framer-motion";
import { format } from "date-fns";
import { Bot, User, Copy, RotateCcw, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Avatar, AvatarFallback } from "@renderer/components/ui/avatar";
import { Button } from "@renderer/components/ui/button";
import { TypingIndicator } from "./typing-indicator";
import { useChatStore, type Message } from "@renderer/store/chat-store";
import { useThemeStore } from "@renderer/store/theme-store";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { theme } = useThemeStore();
  const { updateMessage, deleteMessage, getCurrentSession } = useChatStore();
  const currentSession = getCurrentSession();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // TODO: 显示复制成功提示
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  const handleDelete = () => {
    if (currentSession) {
      deleteMessage(currentSession.id, message.id);
    }
  };

  const handleRetry = () => {
    if (currentSession && message.role === "assistant") {
      // TODO: 重新生成消息
      console.log("重新生成消息");
    }
  };

  if (message.role === "user") {
    return (
      <div className="group flex justify-end">
        <div className="flex max-w-[80%] items-start gap-3">
          {/* 操作按钮 - 在用户消息左侧 */}
          <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy} title="复制">
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDelete} title="删除">
              <Trash className="h-3 w-3" />
            </Button>
          </div>

          {/* 消息内容 */}
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2">
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            <div className="mt-1 text-xs opacity-70">{format(message.timestamp, "HH:mm")}</div>
          </div>

          {/* 用户头像 */}
          <Avatar className="mt-1 h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  // AI 消息
  return (
    <div className="group flex justify-start">
      <div className="flex max-w-[85%] items-start gap-3">
        {/* AI 头像 */}
        <Avatar className="mt-1 h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        {/* 消息内容 */}
        <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2">
          {message.isLoading ? (
            <TypingIndicator />
          ) : (
            <>
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                <ReactMarkdown
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={theme === "dark" ? oneDark : oneLight}
                          language={match[1]}
                          PreTag="div"
                          className="!mt-2 !mb-2 rounded-md"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              <div className="text-muted-foreground mt-1 text-xs">{format(message.timestamp, "HH:mm")}</div>
            </>
          )}
        </div>

        {/* 操作按钮 - 在AI消息右侧 */}
        {!message.isLoading && (
          <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy} title="复制">
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRetry} title="重新生成">
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDelete} title="删除">
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
