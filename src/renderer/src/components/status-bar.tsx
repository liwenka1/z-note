import { useNotesStore } from "@renderer/store";
import { useParams } from "@tanstack/react-router";

export function StatusBar() {
  const { notes } = useNotesStore();

  // 尝试获取当前笔记参数
  let currentNoteId: string | undefined;
  try {
    const params = useParams({ from: "/notes/$noteId" });
    currentNoteId = params?.noteId;
  } catch {
    // 如果不在笔记页面，忽略错误
  }

  // 获取当前笔记
  const currentNote = currentNoteId ? notes.find((note) => note.id === currentNoteId) : null;

  // 计算统计信息
  const activeNotes = notes.filter((note) => !note.isDeleted);
  const totalNotes = activeNotes.length;
  const currentNoteWords = currentNote?.content?.length || 0;

  return (
    <div className="border-border bg-secondary/30 text-foreground fixed right-0 bottom-0 left-0 z-50 flex h-6 w-full items-center justify-between border-t px-4 text-xs">
      <div className="flex items-center gap-4">
        <span>总笔记: {totalNotes}</span>
        {currentNote && (
          <>
            <span>•</span>
            <span>字数: {currentNoteWords}</span>
            <span>•</span>
            <span>修改: {new Date(currentNote.updatedAt).toLocaleString()}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span>Z-Note</span>
      </div>
    </div>
  );
}
