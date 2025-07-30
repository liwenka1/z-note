import { createFileRoute } from "@tanstack/react-router";
import { NoteDetailPage } from "@renderer/pages/note-detail-page";

export const Route = createFileRoute("/notes/$noteId")({
  component: NoteDetail
});

function NoteDetail() {
  const { noteId } = Route.useParams();

  return <NoteDetailPage noteId={noteId} />;
}
