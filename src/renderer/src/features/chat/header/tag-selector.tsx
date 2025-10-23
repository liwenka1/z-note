/**
 * 标签选择器组件
 * 让用户可以为当前对话关联一个标签
 */
import { Button } from "@renderer/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { Tag, X } from "lucide-react";
import { useTags } from "@renderer/hooks/queries";
import { useChatStore, useChatTagStore } from "@renderer/stores";

export function TagSelector() {
  const { data: tags } = useTags();
  const { getCurrentSession } = useChatStore();
  const { currentAssociatedTagId, setAssociatedTag, clearAssociation } = useChatTagStore();

  const currentSession = getCurrentSession();

  // 过滤掉聊天标签，只显示用户创建的知识标签
  const knowledgeTags = tags?.filter((tag) => !tag.name.startsWith("chat_")) || [];

  const handleTagSelect = (tagIdStr: string) => {
    const tagId = parseInt(tagIdStr);
    setAssociatedTag(tagId);
  };

  const handleClearTag = () => {
    clearAssociation();
  };

  const selectedTag = currentAssociatedTagId ? knowledgeTags.find((tag) => tag.id === currentAssociatedTagId) : null;

  if (!currentSession) {
    return <div className="text-muted-foreground text-xs">请先创建或选择一个对话</div>;
  }

  return (
    <div className="flex items-center gap-2">
      {/* 标签状态显示 */}
      {selectedTag ? (
        <div className="bg-primary/10 text-primary flex items-center gap-1 rounded px-2 py-1 text-xs">
          <Tag className="h-3 w-3" />
          <span>{selectedTag.name}</span>
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={handleClearTag}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Tag className="text-muted-foreground h-3 w-3" />
          <span className="text-muted-foreground text-xs">未关联标签</span>
        </div>
      )}

      {/* 标签选择器 */}
      <Select value={currentAssociatedTagId?.toString() || ""} onValueChange={handleTagSelect}>
        <SelectTrigger className="h-7 w-32 text-xs">
          <SelectValue placeholder="选择标签" />
        </SelectTrigger>
        <SelectContent>
          {knowledgeTags.length === 0 ? (
            <div className="text-muted-foreground p-2 text-xs">
              暂无可选标签
              <br />
              请先在标签面板创建标签
            </div>
          ) : (
            knowledgeTags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id.toString()}>
                <span>{tag.name}</span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
