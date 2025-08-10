import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // 配置 remark 插件
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className={`h-full overflow-y-auto p-6 ${className}`}>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={remarkPlugins}>
          {content || "*预览区域*\n\n在左侧编辑器中输入 Markdown 内容..."}
        </ReactMarkdown>
      </div>
    </div>
  );
}
