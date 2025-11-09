import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Badge } from "@renderer/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { Edit, Trash2, Check, CheckCircle, Copy } from "lucide-react";
import { type Prompt } from "@renderer/stores";
import { usePromptStore } from "@renderer/stores";

interface PromptCardProps {
  prompt: Prompt;
  onSetCurrent: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function PromptCard({ prompt, onSetCurrent, onEdit, onDelete, onDuplicate }: PromptCardProps) {
  const { getCurrentPrompt, canEdit, canDelete } = usePromptStore();
  const currentPrompt = getCurrentPrompt();
  const isCurrent = currentPrompt?.id === prompt.id;
  const isEditable = canEdit(prompt.id);
  const isDeletable = canDelete(prompt.id);

  return (
    <TooltipProvider>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{prompt.name}</h4>
              {prompt.isBuiltIn && (
                <Badge variant="secondary" className="text-xs">
                  内置
                </Badge>
              )}
              {isCurrent && (
                <Badge variant="default" className="text-xs">
                  使用中
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {/* 编辑按钮 - 内置的禁用 */}
              {isEditable ? (
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" disabled>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>内置 Prompt 不可编辑</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* 复制按钮 - 内置的显示，用于创建副本 */}
              {prompt.isBuiltIn && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={onDuplicate}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>复制为可编辑副本</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* 删除按钮 - 只有非内置的显示 */}
              {isDeletable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
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
            <Button
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              onClick={onSetCurrent}
              disabled={isCurrent}
              className="!transition-none"
            >
              {isCurrent ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  使用中
                </>
              ) : (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  设为使用
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
