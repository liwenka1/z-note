import { Button } from "@renderer/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { type Prompt } from "@renderer/stores";
import { PromptCard } from "./prompt-card";

interface PromptListProps {
  prompts: Prompt[];
  onSetCurrent: (id: string) => void;
  onEditClick: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddPrompt: () => void;
}

export function PromptList({
  prompts,
  onSetCurrent,
  onEditClick,
  onDelete,
  onDuplicate,
  onAddPrompt
}: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <MessageSquare className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-medium">暂无 Prompt 模板</h3>
        <p className="text-muted-foreground mt-2">添加你的第一个 Prompt 模板来开始使用</p>
        <Button className="mt-4" onClick={onAddPrompt}>
          <Plus className="mr-2 h-4 w-4" />
          添加 Prompt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onSetCurrent={() => onSetCurrent(prompt.id)}
          onEdit={() => onEditClick(prompt)}
          onDelete={() => onDelete(prompt.id)}
          onDuplicate={() => onDuplicate(prompt.id)}
        />
      ))}
    </div>
  );
}
