import { NoteEditor } from "@renderer/components/editor";

interface NoteDetailPageProps {
  noteId: string;
}

export function NoteDetailPage({ noteId }: NoteDetailPageProps) {
  return (
    <div className="h-full">
      <NoteEditor noteId={noteId} />
    </div>
  );
}
