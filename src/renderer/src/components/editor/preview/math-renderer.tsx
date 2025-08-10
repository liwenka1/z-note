import { useEffect, useRef } from "react";
import katex from "katex";

interface MathRendererProps {
  math: string;
  block?: boolean;
}

export function MathRenderer({ math, block = false }: MathRendererProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const containerRef = block ? blockRef : inlineRef;
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          errorColor: "#cc0000"
        });
      } catch {
        if (containerRef.current) {
          containerRef.current.textContent = `Math Error: ${math}`;
        }
      }
    }
  }, [math, block]);

  if (block) {
    return <div ref={blockRef} className="my-4 text-center" />;
  }

  return <span ref={inlineRef} className="inline-block" />;
}
