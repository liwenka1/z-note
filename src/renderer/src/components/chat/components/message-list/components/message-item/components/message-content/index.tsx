import ReactMarkdown from "react-markdown";
import { TypingIndicator } from "./components/typing-indicator";
import { CodeBlock, CodeBlockCopyButton } from "@renderer/components/ai-elements/code-block";
import { type Message } from "@renderer/stores";

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
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
              <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} className="!mt-2 !mb-2">
                <CodeBlockCopyButton />
              </CodeBlock>
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
