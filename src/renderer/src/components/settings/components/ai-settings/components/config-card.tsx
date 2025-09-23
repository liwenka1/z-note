import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { AI_PROVIDERS, type AIConfig } from "@renderer/stores/ai-config-store";
import { EditConfigForm } from "./edit-config-form";

interface ConfigCardProps {
  config: AIConfig;
  isDefault: boolean;
  onSetDefault: () => void;
  onEdit: (updates: Partial<AIConfig>) => void;
  onDelete: () => void;
}

export function ConfigCard({ config, isDefault, onSetDefault, onEdit, onDelete }: ConfigCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditConfigForm
        config={config}
        onSave={(updates) => {
          onEdit(updates);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{config.name}</h4>
            {isDefault && <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs">默认</span>}
          </div>
          <p className="text-muted-foreground text-sm">
            {AI_PROVIDERS.find((p) => p.id === config.provider)?.displayName} · {config.model}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 设为默认 */}
          {!isDefault && (
            <Button size="sm" variant="outline" onClick={onSetDefault}>
              设为默认
            </Button>
          )}

          {/* 编辑 */}
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            编辑
          </Button>

          {/* 删除 */}
          <Button size="sm" variant="outline" onClick={onDelete} disabled={isDefault}>
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}
