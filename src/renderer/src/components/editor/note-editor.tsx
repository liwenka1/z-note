import { useEffect } from "react";
import { useNotesStore } from "@renderer/store";
import { useTabStore } from "@renderer/store/tab-store";
import { useEditorStore } from "@renderer/store/editor-store";
// TODO: 在这里导入你选择的编辑器组件

interface NoteEditorProps {
  noteId: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes } = useNotesStore();
  const { openTab } = useTabStore();
  const { startEditing, getEditingContent } = useEditorStore();

  const note = notes.find((n) => n.id === noteId);

  // 获取编辑内容，如果没有则使用笔记原始内容
  // const editingContent = getEditingContent(noteId) || note?.content || "";

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

  // TODO: 待编辑器完善后添加内容变化和保存处理
  // const handleContentChange = (newContent: string) => {
  //   updateContent(noteId, newContent);
  // };

  // const handleSave = () => {
  //   if (note) {
  //     updateNote(noteId, { content: editingContent });
  //     saveNote(noteId);
  //   }
  // };

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
    <div className="h-full w-full overflow-auto p-6">
      {/* TODO: 在这里添加你选择的编辑器组件 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>编辑器区域</h2>
        <p>请选择并集成你想要的编辑器组件。</p>
        <p>
          当前笔记: <strong>{note.title}</strong>
        </p>
      </div>
    </div>
  );
}
