import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notes/$noteId")({
  component: NoteDetail
});

function NoteDetail() {
  const { noteId } = Route.useParams();

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold">笔记详情</h1>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground mb-4">当前笔记ID: {noteId}</p>
          <p className="text-muted-foreground">笔记编辑器内容待开发...</p>
        </div>
      </div>
    </div>
  );
}
