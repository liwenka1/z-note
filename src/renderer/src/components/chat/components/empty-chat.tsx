import { Bot } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      {/* AI 图标 */}
      <div className="bg-secondary/50 mb-4 rounded-full p-4">
        <Bot className="text-muted-foreground h-8 w-8" />
      </div>

      {/* 助手提示 */}
      <div className="mb-4">
        <h3 className="mb-2 text-base font-medium">我是 AI 助手</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          有什么可以帮助您的吗？
        </p>
      </div>
    </div>
  );
}
