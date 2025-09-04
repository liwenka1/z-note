import { TipTapEditor } from "./components/tiptap-editor";
import { NoteNotFound } from "./components/note-not-found";
import { useEditorState } from "./hooks/use-editor-state";

interface NoteEditorProps {
  noteId: string;
}

/**
 * Editor 主组件
 * 参考 chat 的模式，组合所有子组件
 */
export function NoteEditor({ noteId }: NoteEditorProps) {
  const { note, editingContent, handleContentChange, handleSave } = useEditorState(noteId);

  if (!note) {
    return <NoteNotFound noteId={noteId} />;
  }

  return (
    <div className="bg-background h-full w-full overflow-auto">
      <TipTapEditor
        content={editingContent}
        onChange={handleContentChange}
        onSave={handleSave}
        className="bg-background min-h-full"
      />
    </div>
  );
}
