import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Plus } from "lucide-react";
import { usePromptStore, type Prompt } from "@renderer/stores";
import { PromptList } from "./prompt-list";
import { AddPromptDialog } from "./add-prompt-dialog";
import { EditPromptDialog } from "./edit-prompt-dialog";

export function PromptSettingsPanel() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const { prompts, loadPrompts, addPrompt, updatePrompt, deletePrompt, setCurrentPrompt } = usePromptStore();

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleEditClick = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updates: Partial<Prompt>) => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, updates);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Prompt 配置</h3>
          <p className="text-muted-foreground text-sm">管理你的 AI 对话提示词模板</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加 Prompt
        </Button>
      </div>

      {/* Prompt 列表 */}
      <PromptList
        prompts={prompts}
        onSetCurrent={setCurrentPrompt}
        onEditClick={handleEditClick}
        onDelete={deletePrompt}
        onAddPrompt={() => setAddDialogOpen(true)}
      />

      {/* 添加 Prompt 弹窗 */}
      <AddPromptDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSave={addPrompt} />

      {/* 编辑 Prompt 弹窗 */}
      <EditPromptDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        prompt={editingPrompt}
        onSave={handleEditSave}
      />
    </div>
  );
}
