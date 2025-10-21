import { useState } from "react";
import type { AIPlatform } from "../constants/ai-platforms";

/**
 * Playground 视图状态管理 Hook
 * 职责：封装视图切换逻辑
 */
export function usePlaygroundState() {
  const [selectedPlatform, setSelectedPlatform] = useState<AIPlatform | null>(null);

  // 当前视图类型：列表视图或 Webview 视图
  const currentView = selectedPlatform ? "webview" : "list";

  // 选择平台（切换到 Webview 视图）
  const selectPlatform = (platform: AIPlatform) => {
    setSelectedPlatform(platform);
  };

  // 返回列表视图
  const backToList = () => {
    setSelectedPlatform(null);
  };

  return {
    // 状态
    currentView,
    selectedPlatform,

    // 操作
    selectPlatform,
    backToList
  };
}
