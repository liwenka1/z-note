import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Edit2, Trash2, Check, X, NotebookPen } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";
import { useUpdateNote, useDeleteNote } from "@renderer/hooks";
import { useTabStore } from "@renderer/stores/tab-store";

interface NoteItemProps {
  note: { id: string; title: string; folderId?: string };
  level: number;
}

export function NoteItem({ note, level }: NoteItemProps) {
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { openTab } = useTabStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);

  const handleNoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openTab(note.id, note.title);
    navigate({ to: "/notes/$noteId", params: { noteId: note.id } });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== note.title) {
      updateNote({
        id: note.id,
        data: { title: editTitle.trim() }
      });
    }
    setIsEditing(false);
    setEditTitle(note.title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(note.title);
  };

  const handleDelete = () => {
    deleteNote(note.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className="group hover:bg-secondary/60 flex cursor-pointer items-center rounded-md py-1.5 pr-2 text-sm transition-colors"
      style={{ paddingLeft: `${(level + 1) * 12 + 18}px` }}
    >
      <div className="mr-2">
        <NotebookPen className="h-4 w-4" />
      </div>

      {/* 笔记标题 */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-background border-border focus:ring-ring mr-2 flex-1 rounded border px-2 py-0.5 text-sm focus:ring-1 focus:outline-none"
          autoFocus
        />
      ) : (
        <Link
          to="/notes/$noteId"
          params={{ noteId: note.id }}
          className="text-foreground hover:text-foreground flex-1 truncate hover:bg-transparent"
          onClick={handleNoteClick}
        >
          {note.title}
        </Link>
      )}

      {/* 更多操作按钮 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-secondary hover:text-foreground h-4 w-4 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Edit2 className="mr-2 h-3 w-3" />
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="mr-2 h-3 w-3" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 编辑模式的保存/取消按钮 */}
      {isEditing && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0 text-green-600 hover:bg-green-50"
            onClick={handleSave}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0 text-red-600 hover:bg-red-50"
            onClick={handleCancel}
          >
            <X className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
}
