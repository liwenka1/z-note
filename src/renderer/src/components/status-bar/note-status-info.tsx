import { useTabStore, useEditorStore } from "@renderer/stores";
import { calculateDocumentStats } from "@renderer/utils/tiptap-content-extractor";
import { useActiveNote } from "@renderer/hooks";

export function NoteStatusInfo() {
  const { activeTabId } = useTabStore();
  const { noteData, noteTitle, isLoading, isSettingsTab } = useActiveNote();

  // 订阅 contentVersion 以便在内容变化时重新渲染
  useEditorStore((state) => state.contentVersion);
  const getNoteContent = useEditorStore((state) => state.getNoteContent);
  const isNoteModified = useEditorStore((state) => state.isNoteModified);

  // 获取当前活跃笔记的编辑状态
  const editingContent = activeTabId ? getNoteContent(activeTabId) : null;
  const isModified = activeTabId ? isNoteModified(activeTabId) : false;

  // 计算字符数
  const characterCount = editingContent
    ? calculateDocumentStats(editingContent).characterCount
    : noteData?.metadata?.characterCount || 0;

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center gap-4">
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-4">
      {activeTabId ? (
        <>
          {isSettingsTab ? (
            <span>设置</span>
          ) : (
            <>
              <span>笔记: {noteTitle}</span>
              <span>•</span>
              <span>字符数: {characterCount}</span>
              <span>•</span>
              <span>状态: {isModified ? "未保存" : "已保存"}</span>
            </>
          )}
        </>
      ) : (
        <span>未选择笔记</span>
      )}
    </div>
  );
}
