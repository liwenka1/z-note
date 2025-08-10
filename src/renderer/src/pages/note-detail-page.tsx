import { useEffect } from "react";
import { useNotesStore } from "@renderer/store";
import { useTabStore } from "@renderer/store/tab-store";
import { useEditorStore } from "@renderer/store/editor-store";
import { SimpleEditor } from "@renderer/components/editor/simple-editor";

interface NoteDetailPageProps {
  noteId: string;
}

export function NoteDetailPage({ noteId }: NoteDetailPageProps) {
  const { notes } = useNotesStore();
  const { openTab } = useTabStore();
  const { startEditing, isNoteModified } = useEditorStore();

  const note = notes.find((n) => n.id === noteId);

  // 当页面加载时，确保标签是打开的
  useEffect(() => {
    if (note) {
      openTab(noteId, note.title);
      // 只在还没有编辑状态时才开始编辑
      const { getEditingContent } = useEditorStore.getState();
      if (getEditingContent(noteId) === undefined) {
        startEditing(noteId, note.content);
      }
    }

    // 注意：不要在组件卸载时停止编辑，因为用户可能只是切换标签
    // 编辑状态应该在真正关闭标签时才清除
  }, [noteId, note, openTab, startEditing]);

  if (!note) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-2xl font-semibold">笔记未找到</h1>
            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground">无法找到ID为 {noteId} 的笔记。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{note.title}</h1>
            {isNoteModified(noteId) && (
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                未保存
              </span>
            )}
          </div>
          <div className="bg-card rounded-lg border p-6">
            <p className="text-muted-foreground mb-4">笔记ID: {noteId}</p>
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-medium">编辑器</h3>
              <SimpleEditor noteId={noteId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
