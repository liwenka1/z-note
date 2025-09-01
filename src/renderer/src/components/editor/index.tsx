import { TipTapEditor } from "./components/tiptap-editor";
import { NoteNotFound } from "./components/note-not-found";
import { useEditorState } from "./hooks/use-editor-state";
import { EDITOR_CLASSES } from "./constants/editor";

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
    <div className={EDITOR_CLASSES.CONTAINER}>
      <TipTapEditor
        content={editingContent}
        onChange={handleContentChange}
        onSave={handleSave}
        className={EDITOR_CLASSES.TIPTAP_CONTAINER}
      />
    </div>
  );
}
