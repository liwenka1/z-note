interface NoteNotFoundProps {
  noteId: string;
}

export function NoteNotFound({ noteId }: NoteNotFoundProps) {
  return (
    <div className="bg-background flex h-full flex-col">
      <div className="border-border bg-background border-b p-4">
        <h2 className="text-lg font-semibold">笔记未找到</h2>
        <p className="text-muted-foreground">无法找到ID为 {noteId} 的笔记。</p>
      </div>
    </div>
  );
}
