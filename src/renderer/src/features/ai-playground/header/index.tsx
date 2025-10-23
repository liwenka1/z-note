import { BackButton } from "./back-button";
import { AddPlatformDialog } from "../dialogs/add-platform-dialog";
import type { AIPlatform } from "../constants/ai-platforms";

/**
 * Playground Header 组件
 * 职责：头部布局和组件组合
 */
interface PlaygroundHeaderProps {
  variant: "list" | "webview";
  platform?: AIPlatform;
  onBack?: () => void;
}

export function PlaygroundHeader({ variant, platform, onBack }: PlaygroundHeaderProps) {
  return (
    <div className="border-border/50 bg-secondary/30 border-b">
      <div className="flex h-12 items-center justify-between px-4">
        {/* 左侧：标题 */}
        <h2 className="text-foreground text-sm font-medium">{variant === "list" ? "AI 工作台" : platform?.name}</h2>

        {/* 右侧：操作按钮 */}
        {variant === "list" ? <AddPlatformDialog /> : onBack && <BackButton onClick={onBack} />}
      </div>
    </div>
  );
}
