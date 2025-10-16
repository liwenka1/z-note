import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { TypingIndicator } from "./components/typing-indicator";
import { useTheme } from "next-themes";
import { type Message } from "@renderer/stores";

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  const { theme } = useTheme();

  const hasContent = typeof message.content === "string" && message.content.trim().length > 0;
  const isPending = Boolean((message.isLoading || message.isStreaming) && !hasContent);

  if (isPending) {
    return <TypingIndicator />;
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
      <ReactMarkdown
        components={{
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isCodeBlock = match && String(children).includes("\n");

            return isCodeBlock ? (
              <SyntaxHighlighter
                style={theme === "dark" ? oneDark : oneLight}
                language={match[1]}
                PreTag="div"
                className="!mt-2 !mb-2 rounded-md"
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
  );
}
