import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Badge } from "@renderer/components/ui/badge";
import { Edit, Trash2, Check, CheckCircle } from "lucide-react";
import { type Prompt } from "@renderer/stores/prompt-store";
import { EditPromptForm } from "./edit-prompt-form";
import { usePromptStore } from "@renderer/stores/prompt-store";

interface PromptCardProps {
  prompt: Prompt;
  onSetCurrent: () => void;
  onEdit: (updates: Partial<Prompt>) => void;
  onDelete: () => void;
}

export function PromptCard({ prompt, onSetCurrent, onEdit, onDelete }: PromptCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { currentPrompt } = usePromptStore();
  const isCurrent = currentPrompt?.id === prompt.id;

  const handleEdit = (updates: Partial<Prompt>) => {
    onEdit(updates);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (prompt.isDefault) return; // 保护默认 prompt
    onDelete();
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <EditPromptForm prompt={prompt} onSave={handleEdit} onCancel={() => setIsEditing(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{prompt.name}</h4>
            {prompt.isDefault && (
              <Badge variant="secondary" className="text-xs">
                默认
              </Badge>
            )}
            {isCurrent && (
              <Badge variant="default" className="text-xs">
                当前
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            {!prompt.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {prompt.description && <p className="text-muted-foreground text-sm">{prompt.description}</p>}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-muted rounded-md p-3">
          <p className="text-sm whitespace-pre-wrap">{prompt.content}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Button variant={isCurrent ? "default" : "outline"} size="sm" onClick={onSetCurrent} disabled={isCurrent}>
            {isCurrent ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                当前使用
              </>
            ) : (
              <>
                <Check className="mr-1 h-3 w-3" />
                设为当前
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
