import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Plus } from "lucide-react";
import { useAIConfigStore, type AIConfig } from "@renderer/stores";
import { ConfigList } from "./config-list";
import { AddConfigDialog } from "./add-config-dialog";
import { EditConfigDialog } from "./edit-config-dialog";

export function AISettingsPanel() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);

  const { configs, loadConfigs, addConfig, updateConfig, deleteConfig, setDefaultConfig } = useAIConfigStore();

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleEditClick = (config: AIConfig) => {
    setEditingConfig(config);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updates: Partial<AIConfig>) => {
    if (editingConfig) {
      updateConfig(editingConfig.id, updates);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">AI 配置</h3>
          <p className="text-muted-foreground text-sm">管理你的 AI 模型和 API 密钥</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加配置
        </Button>
      </div>

      {/* 配置列表 */}
      <ConfigList
        configs={configs}
        onSetDefault={setDefaultConfig}
        onEditClick={handleEditClick}
        onDelete={deleteConfig}
        onAddConfig={() => setAddDialogOpen(true)}
      />

      {/* 添加配置弹窗 */}
      <AddConfigDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSave={addConfig} />

      {/* 编辑配置弹窗 */}
      <EditConfigDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        config={editingConfig}
        onSave={handleEditSave}
      />
    </div>
  );
}
