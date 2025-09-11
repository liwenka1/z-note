import { useNavigate } from "@tanstack/react-router";
import { useFolders, useNotes, useCreateFolder, useCreateNote } from "@renderer/hooks";
import { useFilesUIStore } from "@renderer/stores";
import type { Folder } from "@renderer/types";
import { FolderItem } from "./folder-item";
import { NoteItem } from "./note-item";

export function FolderTree() {
  const { data: folders = [] } = useFolders();
  const { data: notes = [] } = useNotes();
  const { mutate: createFolder } = useCreateFolder();
  const { mutate: createNote } = useCreateNote();
  const { selectedFolderId, setSelectedFolder, toggleFolderExpanded, expandedFolderIds } = useFilesUIStore();
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
      color: "#6b7280",
      icon: "📁"
    });
  };

  const handleCreateNoteInFolder = (folderId: string) => {
    createNote(
      {
        title: `新笔记 ${Date.now()}`,
        content: "",
        folderId,
        tagIds: []
      },
      {
        onSuccess: (newNote) => {
          navigate({ to: "/notes/$noteId", params: { noteId: newNote.id } });
        }
      }
    );
  };

  return (
    <div className="h-full overflow-auto p-3">
      <div className="space-y-1">
        {/* 根级别文件夹 */}
        {rootFolders
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))
          .map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              level={0}
              isSelected={selectedFolderId === folder.id}
              isExpanded={expandedFolderIds.has(folder.id)}
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
            <NoteItem key={note.id} note={note} level={0} />
          ))}
      </div>
    </div>
  );
}
