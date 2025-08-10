import { useState, useEffect } from "react";
import { useEditorStore } from "@renderer/store/editor-store";
import { useNotesStore } from "@renderer/store";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";

interface SimpleEditorProps {
  noteId: string;
}

export function SimpleEditor({ noteId }: SimpleEditorProps) {
  const { notes, updateNote } = useNotesStore();
  const { getEditingContent, updateContent, saveNote, isNoteModified, resetNote } = useEditorStore();

  const note = notes.find((n) => n.id === noteId);
  const [localContent, setLocalContent] = useState("");
  const [initialized, setInitialized] = useState(false);

  // 初始化本地内容 - 只在第一次或noteId改变时初始化
  useEffect(() => {
    const editingContent = getEditingContent(noteId);
    if (editingContent !== undefined) {
      setLocalContent(editingContent);
    } else if (note) {
      setLocalContent(note.content);
    }
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  // 当切换回标签时，确保从store中恢复内容
  useEffect(() => {
    if (initialized) {
      const editingContent = getEditingContent(noteId);
      if (editingContent !== undefined) {
        setLocalContent(editingContent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, initialized]);

  // 添加键盘快捷键支持 (Ctrl+S 保存)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (isNoteModified(noteId) && note) {
          updateNote(noteId, { content: localContent });
          saveNote(noteId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [noteId, localContent, note, updateNote, saveNote, isNoteModified]);

  // 处理内容变更
  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent);
    updateContent(noteId, newContent);
  };

  // 手动保存
  const handleSave = () => {
    if (note) {
      updateNote(noteId, { content: localContent });
      saveNote(noteId);
    }
  };

  // 重置到原始状态
  const handleReset = () => {
    resetNote(noteId);
    if (note) {
      setLocalContent(note.content);
    }
  };

  if (!note) {
    return <div>笔记未找到</div>;
  }

  const isModified = isNoteModified(noteId);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">编辑器</h3>
        <div className="flex items-center gap-2">
          {isModified && <span className="text-sm text-orange-600">有未保存的更改</span>}
          <Button variant="outline" size="sm" onClick={handleReset} disabled={!isModified}>
            重置
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} disabled={!isModified}>
            保存 (Ctrl+S)
          </Button>
        </div>
      </div>

      <Textarea
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="在这里编辑笔记内容..."
        className="min-h-[400px] resize-none"
      />

      <div className="text-muted-foreground text-sm">
        <p>字符数：{localContent.length}</p>
        <p>状态：{isModified ? "已修改" : "已保存"}</p>
        <p className="mt-1 text-xs">提示：使用 Ctrl+S 保存更改</p>
      </div>
    </div>
  );
}
