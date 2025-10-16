import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Plus } from "lucide-react";
import { usePromptStore } from "@renderer/stores";
import { PromptList } from "./components/prompt-list";
import { AddPromptForm } from "./components/add-prompt-form";

export function PromptSettingsPanel() {
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);

  const { prompts, loadPrompts, addPrompt, updatePrompt, deletePrompt, setCurrentPrompt } = usePromptStore();

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Prompt 配置</h3>
          <p className="text-muted-foreground text-sm">管理你的 AI 对话提示词模板</p>
        </div>
        <Button onClick={() => setIsAddingPrompt(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加 Prompt
        </Button>
      </div>

      {/* Prompt 列表 */}
      <PromptList
        prompts={prompts}
        onSetCurrent={setCurrentPrompt}
        onEdit={updatePrompt}
        onDelete={deletePrompt}
        onAddPrompt={() => setIsAddingPrompt(true)}
      />

      {/* 添加 Prompt 表单 */}
      {isAddingPrompt && (
        <AddPromptForm
          onSave={(prompt) => {
            addPrompt(prompt);
            setIsAddingPrompt(false);
          }}
          onCancel={() => setIsAddingPrompt(false)}
        />
      )}
    </div>
  );
}
