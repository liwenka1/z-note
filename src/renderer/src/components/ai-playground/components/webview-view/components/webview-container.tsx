import { useEffect, useRef } from "react";
import type { AIPlatform } from "../../../constants/ai-platforms";

/**
 * Webview 容器组件
 * 职责：Webview 元素的创建和管理
 * 注意：保持原有逻辑不变
 */
interface WebviewContainerProps {
  platform: AIPlatform;
}

export function WebviewContainer({ platform }: WebviewContainerProps) {
  const webviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = webviewRef.current;
    if (!container) return;

    // 清空容器
    container.innerHTML = "";

    // 创建 webview 元素
    const webview = document.createElement("webview");
    webview.src = platform.url;
    webview.style.width = "100%";
    webview.style.height = "100%";
    webview.style.border = "none";
    webview.style.overflow = "auto";
    webview.setAttribute("partition", "persist:aiplayground");
    webview.setAttribute("allowpopups", "true");
    webview.setAttribute("webpreferences", "contextIsolation=yes");

    // 添加到容器
    container.appendChild(webview);

    return () => {
      // 清理 - 使用 effect 开始时捕获的 container 变量
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [platform.url]);

  return <div ref={webviewRef} className="h-full w-full" />;
}
