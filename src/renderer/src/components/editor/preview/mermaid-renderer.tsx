import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: string;
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初始化 Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose"
    });
  }, []);

  useEffect(() => {
    if (containerRef.current && chart) {
      const renderChart = async () => {
        try {
          setError(null);
          // 生成唯一ID
          const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // 渲染图表
          const { svg } = await mermaid.render(id, chart);

          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (err) {
          setError(`Mermaid 渲染错误: ${err instanceof Error ? err.message : "未知错误"}`);
        }
      };

      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive my-4 rounded border p-4">
        <p className="font-medium">图表渲染失败</p>
        <p className="text-sm">{error}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm">查看原始代码</summary>
          <pre className="bg-muted mt-2 overflow-x-auto rounded p-2 text-xs">
            <code>{chart}</code>
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-center">
      <div ref={containerRef} className="max-w-full overflow-x-auto" />
    </div>
  );
}
