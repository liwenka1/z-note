import { FileText, Plus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useNotesStore } from "@renderer/store";
import { useNavigate } from "@tanstack/react-router";
import { FILES_CLASSES, FILES_CONSTANTS } from "../constants/files";

export function FilesHeader() {
  const { createNote, createFolder } = useNotesStore();
  const navigate = useNavigate();

  const handleCreateNote = () => {
    const newNoteId = createNote({
      title: `新笔记 ${Date.now()}`,
      content: "",
      folderId: undefined,
      tags: [],
      isFavorite: false,
      isDeleted: false
    });
    navigate({ to: "/notes/$noteId", params: { noteId: newNoteId } });
  };

  const handleCreateFolder = () => {
    createFolder({
      name: `新文件夹 ${Date.now()}`,
      description: "",
      parentId: undefined,
      color: "#6b7280",
      icon: "📁",
      isDeleted: false,
      sortOrder: 0
    });
  };

  return (
    <div className="border-border/50 bg-secondary/30 border-b">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-foreground text-sm font-medium">笔记</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNote}
            className={FILES_CLASSES.BUTTON_ICON}
            title="新建笔记"
          >
            <FileText className={FILES_CONSTANTS.ICON_SIZE} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateFolder}
            className={FILES_CLASSES.BUTTON_ICON}
            title="新建文件夹"
          >
            <Plus className={FILES_CONSTANTS.ICON_SIZE} />
          </Button>
        </div>
      </div>
    </div>
  );
}
