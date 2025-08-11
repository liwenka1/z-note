import { useMemo, forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content, className, onScroll }, ref) => {
    // 配置 remark 插件
    const remarkPlugins = useMemo(() => [remarkGfm], []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (onScroll) {
        onScroll(e.currentTarget.scrollTop);
      }
    };

    return (
      <div ref={ref} className={`h-full overflow-y-auto p-6 ${className}`} onScroll={handleScroll}>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={remarkPlugins}>
            {content || "*预览区域*\n\n在左侧编辑器中输入 Markdown 内容..."}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
);

MarkdownPreview.displayName = "MarkdownPreview";
