/**
 * Tag列表组件
 * 显示所有Tags和操作按钮
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Plus } from "lucide-react";
import { TagItem } from "./components/tag-item";
import { TagCreateForm } from "./components/tag-create-form";
import type { Tag } from "@renderer/types";

interface TagListProps {
  tags: Tag[];
  onSelectTag: (tagId: number) => void;
}

export function TagList({ tags, onSelectTag }: TagListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border/50 flex shrink-0 items-center justify-between border-b p-4">
        <h2 className="text-sm font-medium">知识标签</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(true)} className="h-7 w-7 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="border-border/50 shrink-0 border-b p-4">
          <TagCreateForm onSuccess={handleCreateSuccess} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Tags List */}
      <div className="flex-1 overflow-y-auto">
        {tags.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">还没有任何标签</div>
              <div className="text-muted-foreground mt-1 text-xs">点击右上角 + 号创建第一个标签</div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {tags.map((tag) => (
              <TagItem key={tag.id} tag={tag} onClick={() => onSelectTag(tag.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
