import { useTabStore } from "@renderer/store/tab-store";
import { useEditorStore } from "@renderer/store/editor-store";
import { useNote } from "@renderer/hooks";

export function NoteStatusInfo() {
  const { activeTabId } = useTabStore();
  const { data: currentNote } = useNote(activeTabId || "");
  const { getEditingContent, isNoteModified } = useEditorStore();

  // 获取当前活跃笔记信息
  const editingContent = activeTabId ? getEditingContent(activeTabId) : null;
  const isModified = activeTabId ? isNoteModified(activeTabId) : false;
  const characterCount = editingContent?.length || currentNote?.content?.length || 0;

  return (
    <div className="text-muted-foreground flex items-center gap-4">
      {currentNote ? (
        <>
          <span>笔记: {currentNote.title}</span>
          <span>•</span>
          <span>字符数: {characterCount}</span>
          <span>•</span>
          <span>状态: {isModified ? "未保存" : "已保存"}</span>
        </>
      ) : (
        <span>未选择笔记</span>
      )}
    </div>
  );
}
