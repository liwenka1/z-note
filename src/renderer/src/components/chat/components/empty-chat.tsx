import { Bot } from "lucide-react";
import { usePromptStore } from "@renderer/stores/prompt-store";

export function EmptyChat() {
  const { currentPrompt } = usePromptStore();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      {/* AI 图标 */}
      <div className="bg-secondary/50 mb-4 rounded-full p-4">
        <Bot className="text-muted-foreground h-8 w-8" />
      </div>

      {/* 助手提示 */}
      <div className="mb-4">
        <h3 className="mb-2 text-base font-medium">{currentPrompt ? currentPrompt.name : "我是 AI 助手"}</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          {currentPrompt ? currentPrompt.description || "有什么可以帮助您的吗？" : "有什么可以帮助您的吗？"}
        </p>
      </div>

      {/* 当前 Prompt 内容预览 */}
      {currentPrompt && (
        <div className="bg-muted/50 max-w-2xl rounded-lg p-4 text-left">
          <h4 className="text-muted-foreground mb-2 text-sm font-medium">当前提示词：</h4>
          <p className="text-sm whitespace-pre-wrap">{currentPrompt.content}</p>
        </div>
      )}
    </div>
  );
}
