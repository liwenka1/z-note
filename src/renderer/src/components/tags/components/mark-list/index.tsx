/**
 * Mark列表组件
 * 显示指定Tag下的所有Marks
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { MarkItem } from "./components/mark-item";
import { MarkCreateForm } from "./components/mark-create-form";
import { useMarksByTag, useTags } from "@renderer/hooks/queries";

interface MarkListProps {
  tagId: number;
  onBack: () => void;
}

export function MarkList({ tagId, onBack }: MarkListProps) {
  const { data: tags } = useTags();
  const { data: marks, isLoading } = useMarksByTag(tagId);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const currentTag = tags?.find((tag) => tag.id === tagId);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border/50 flex shrink-0 items-center gap-2 border-b p-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 w-7 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{currentTag?.name || "未知标签"}</div>
          <div className="text-muted-foreground text-xs">{marks?.length || 0} 条记录</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(true)} className="h-7 w-7 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="border-border/50 shrink-0 border-b p-4">
          <MarkCreateForm tagId={tagId} onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Marks List */}
      <div className="flex-1 overflow-y-auto">
        {!marks || marks.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">还没有任何记录</div>
              <div className="text-muted-foreground mt-1 text-xs">点击右上角 + 号创建第一条记录</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {marks.map((mark) => (
              <MarkItem key={mark.id} mark={mark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
