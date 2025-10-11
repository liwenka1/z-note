import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Badge } from "@renderer/components/ui/badge";
import { Edit, Trash2, Check, CheckCircle } from "lucide-react";
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
      <Card>
        <CardContent className="p-4">
          <EditConfigForm
            config={config}
            onSave={(updates) => {
              onEdit(updates);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{config.name}</h4>
            {isDefault && (
              <Badge variant="default" className="text-xs">
                默认
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDefault}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {AI_PROVIDERS.find((p) => p.id === config.provider)?.displayName} · {config.model}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mt-3 flex items-center justify-between">
          <Button variant={isDefault ? "default" : "outline"} size="sm" onClick={onSetDefault} disabled={isDefault}>
            {isDefault ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                当前使用
              </>
            ) : (
              <>
                <Check className="mr-1 h-3 w-3" />
                设为默认
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
