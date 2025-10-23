import { WebviewContainer } from "./webview-container";
import type { AIPlatform } from "../constants/ai-platforms";

/**
 * Webview 视图容器
 * 职责：Webview 视图布局
 */
interface WebviewViewProps {
  platform: AIPlatform;
}

export function WebviewView({ platform }: WebviewViewProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <WebviewContainer platform={platform} />
    </div>
  );
}
