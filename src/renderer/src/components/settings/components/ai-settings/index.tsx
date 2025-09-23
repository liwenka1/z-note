import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Plus } from "lucide-react";
import { useAIConfigStore } from "@renderer/stores/ai-config-store";
import { ConfigList } from "./components/config-list";
import { AddConfigForm } from "./components/add-config-form";

export function AISettingsPanel() {
  const [isAddingConfig, setIsAddingConfig] = useState(false);

  const { configs, loadConfigs, addConfig, updateConfig, deleteConfig, setDefaultConfig } = useAIConfigStore();

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">AI 配置</h3>
          <p className="text-muted-foreground text-sm">管理你的 AI 模型和 API 密钥</p>
        </div>
        <Button onClick={() => setIsAddingConfig(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加配置
        </Button>
      </div>

      {/* 配置列表 */}
      <ConfigList
        configs={configs}
        onSetDefault={setDefaultConfig}
        onEdit={updateConfig}
        onDelete={deleteConfig}
        onAddConfig={() => setIsAddingConfig(true)}
      />

      {/* 添加配置表单 */}
      {isAddingConfig && (
        <AddConfigForm
          onSave={(config) => {
            addConfig(config);
            setIsAddingConfig(false);
          }}
          onCancel={() => setIsAddingConfig(false)}
        />
      )}
    </div>
  );
}
