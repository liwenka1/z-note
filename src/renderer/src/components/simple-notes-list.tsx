import { Link } from "@tanstack/react-router";
import { FileText, Plus } from "lucide-react";
import { useNotesStore } from "@renderer/store";

export function SimpleNotesList() {
  const { notes, createNote } = useNotesStore();

  // 获取活跃的笔记（未删除的）
  const activeNotes = notes.filter((note) => !note.isDeleted);

  // 创建新笔记
  const handleCreateNote = () => {
    createNote({
      title: "新笔记",
      content: "",
      folderId: undefined,
      tags: [],
      isFavorite: false,
      isDeleted: false,
      lastViewedAt: undefined
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-transparent">
      {/* 头部 */}
      <div className="border-border/50 bg-secondary/20 flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-foreground text-sm font-medium">笔记</h2>
        <button
          onClick={handleCreateNote}
          className="text-muted-foreground hover:bg-secondary/70 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          title="新建笔记"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* 笔记列表 */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-2">
        {activeNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="text-muted-foreground/50 h-12 w-12" />
            <p className="text-muted-foreground mt-2 text-sm">还没有笔记</p>
            <p className="text-muted-foreground text-xs">点击 + 创建第一个笔记</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activeNotes.map((note) => (
              <Link
                key={note.id}
                to="/notes/$noteId"
                params={{ noteId: note.id }}
                className="hover:bg-secondary/60 block rounded-md p-3 text-sm transition-colors"
                activeProps={{ className: "bg-secondary/80 text-foreground" }}
              >
                <div className="text-foreground truncate font-medium">{note.title || "无标题"}</div>
                <div className="text-muted-foreground mt-1 truncate text-xs">
                  {note.content ? note.content.substring(0, 60) + (note.content.length > 60 ? "..." : "") : "空白笔记"}
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
