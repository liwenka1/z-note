import { useNotesStore } from "@renderer/store";
import { useNavigate } from "@tanstack/react-router";
import type { Folder } from "@renderer/types";
import { FolderItem } from "./folder-item";
import { NoteItem } from "./note-item";

export function FolderTree() {
  const { folders, notes, selectedFolderId, setSelectedFolder, toggleFolderExpanded, createFolder, createNote } =
    useNotesStore();
  const navigate = useNavigate();

  // 过滤活跃的文件夹和笔记
  const activeFolders = folders.filter((folder) => !folder.isDeleted);
  const activeNotes = notes.filter((note) => !note.isDeleted);

  // 构建文件夹树
  const buildFolderTree = (folders: Folder[]): Folder[] => {
    return folders.filter((folder) => !folder.parentId);
  };

  const folderTree = buildFolderTree(activeFolders);
  const rootFolders = folderTree;

  // 获取根级别的笔记（没有文件夹的笔记）
  const rootNotes = activeNotes.filter((note) => !note.folderId);

  const handleCreateSubfolder = (parentId: string) => {
    const newFolderName = `新文件夹 ${Date.now()}`;
    createFolder({
      name: newFolderName,
      parentId,
      description: "",
      color: "#6b7280",
      icon: "📁",
      isDeleted: false,
      sortOrder: 0
    });
  };

  const handleCreateNoteInFolder = (folderId: string) => {
    const newNoteId = createNote({
      title: `新笔记 ${Date.now()}`,
      content: "",
      folderId,
      tags: [],
      isFavorite: false,
      isDeleted: false
    });
    navigate({ to: "/notes/$noteId", params: { noteId: newNoteId } });
  };

  return (
    <div className="h-full overflow-auto p-3">
      <div className="space-y-1">
        {/* 根级别文件夹 */}
        {rootFolders
          .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
          .map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              level={0}
              isSelected={selectedFolderId === folder.id}
              onSelect={setSelectedFolder}
              onToggleExpand={toggleFolderExpanded}
              onCreateSubfolder={handleCreateSubfolder}
              onCreateNote={handleCreateNoteInFolder}
              folderNotes={activeNotes}
            />
          ))}

        {/* 根级别笔记 */}
        {rootNotes
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((note) => (
            <NoteItem key={note.id} note={note} level={-1} />
          ))}
      </div>
    </div>
  );
}
