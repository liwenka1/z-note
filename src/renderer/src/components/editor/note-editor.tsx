import { useEffect } from "react";
import { useNotesStore } from "@renderer/store";
import { useTabStore } from "@renderer/store/tab-store";
import { useEditorStore } from "@renderer/store/editor-store";
import { SplitEditor } from "./split-view/split-editor";

interface NoteEditorProps {
  noteId: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes, updateNote } = useNotesStore();
  const { openTab } = useTabStore();
  const { startEditing, updateContent, saveNote, getEditingContent } = useEditorStore();

  const note = notes.find((n) => n.id === noteId);

  // 获取编辑内容，如果没有则使用笔记原始内容
  const editingContent = getEditingContent(noteId) || note?.content || "";

  // 当页面加载时，确保标签是打开的并初始化编辑状态
  useEffect(() => {
    if (note) {
      openTab(noteId, note.title);

      // 只在还没有编辑状态时才开始编辑
      if (getEditingContent(noteId) === undefined) {
        startEditing(noteId, note.content);
      }
    }
  }, [noteId, note, openTab, startEditing, getEditingContent]);

  // 处理内容变化
  const handleContentChange = (newContent: string) => {
    updateContent(noteId, newContent);
  };

  // 处理保存
  const handleSave = () => {
    if (note) {
      updateNote(noteId, { content: editingContent });
      saveNote(noteId);
    }
  };

  if (!note) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-border bg-background border-b p-4">
          <h2 className="text-lg font-semibold">笔记未找到</h2>
          <p className="text-muted-foreground">无法找到ID为 {noteId} 的笔记。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 编辑器主体 */}
      <div className="flex-1 overflow-hidden">
        <SplitEditor noteId={noteId} value={editingContent} onChange={handleContentChange} onSave={handleSave} />
      </div>
    </div>
  );
}
