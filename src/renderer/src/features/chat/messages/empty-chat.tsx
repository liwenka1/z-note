import { Bot } from "lucide-react";
import { usePromptStore } from "@renderer/stores";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent
} from "@renderer/components/ui/empty";

export function EmptyChat() {
  const { getCurrentPrompt } = usePromptStore();
  const currentPrompt = getCurrentPrompt();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bot />
        </EmptyMedia>
        <EmptyTitle>{currentPrompt ? currentPrompt.name : "我是 AI 助手"}</EmptyTitle>
        <EmptyDescription>
          {currentPrompt ? currentPrompt.description || "有什么可以帮助您的吗？" : "有什么可以帮助您的吗？"}
        </EmptyDescription>
      </EmptyHeader>

      {currentPrompt && (
        <EmptyContent>
          <div className="bg-muted/50 max-w-2xl rounded-lg p-4 text-left">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">当前提示词：</h4>
            <p className="text-sm whitespace-pre-wrap">{currentPrompt.content}</p>
          </div>
        </EmptyContent>
      )}
    </Empty>
  );
}
