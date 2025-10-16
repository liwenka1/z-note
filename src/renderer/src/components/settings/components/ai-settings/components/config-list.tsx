import { Button } from "@renderer/components/ui/button";
import { Card, CardContent } from "@renderer/components/ui/card";
import { Bot, Plus } from "lucide-react";
import { type AIConfig } from "@renderer/stores";
import { ConfigCard } from "./config-card";

interface ConfigListProps {
  configs: AIConfig[];
  onSetDefault: (id: string) => void;
  onEdit: (id: string, updates: Partial<AIConfig>) => void;
  onDelete: (id: string) => void;
  onAddConfig: () => void;
}

export function ConfigList({ configs, onSetDefault, onEdit, onDelete, onAddConfig }: ConfigListProps) {
  if (configs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bot className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">暂无 AI 配置</h3>
          <p className="text-muted-foreground mt-2">添加你的第一个 AI 配置来开始使用</p>
          <Button className="mt-4" onClick={onAddConfig}>
            <Plus className="mr-2 h-4 w-4" />
            添加配置
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {configs.map((config) => (
        <ConfigCard
          key={config.id}
          config={config}
          isDefault={config.isDefault}
          onSetDefault={() => onSetDefault(config.id)}
          onEdit={(updates) => onEdit(config.id, updates)}
          onDelete={() => onDelete(config.id)}
        />
      ))}
    </div>
  );
}
