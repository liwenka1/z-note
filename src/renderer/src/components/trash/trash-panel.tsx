import { useState } from "react";
import { motion } from "framer-motion";
import { useNotesStore } from "@renderer/store";
import { RestoreDialog } from "./restore-dialog";
import { TrashItem } from "./trash-item";
import { EmptyTrash } from "./empty-trash";
import { filterNotesByDeleted } from "@renderer/utils/data-utils";
import type { Note } from "@renderer/types";

export function TrashPanel() {
  // 使用选择器来确保正确的响应性
  const notes = useNotesStore((state) => state.notes);
  const folders = useNotesStore((state) => state.folders);
  const restoreNote = useNotesStore((state) => state.restoreNote);
  const permanentDeleteNote = useNotesStore((state) => state.permanentDeleteNote);
  const restoreFolder = useNotesStore((state) => state.restoreFolder);
  const permanentDeleteFolder = useNotesStore((state) => state.permanentDeleteFolder);

  // 在组件内计算删除的项目
  const deletedNotes = filterNotesByDeleted(notes, true);
  const deletedFolders = folders.filter((folder) => folder.isDeleted);

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleRestoreNote = (note: Note) => {
    // 检查原始文件夹是否存在
    const originalFolder = note.folderId ? folders.find((f) => f.id === note.folderId) : null;
    const originalFolderExists = originalFolder && !originalFolder.isDeleted;

    if (originalFolderExists) {
      // 原始位置存在，直接恢复
      restoreNote(note.id);
    } else {
      // 原始位置不存在，显示选择对话框
      setSelectedNote(note);
      setRestoreDialogOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* 头部 */}
      <div className="border-border/50 border-b p-4">
        <h3 className="text-sm font-medium">回收站</h3>
        <p className="text-muted-foreground mt-1 text-xs">{deletedNotes.length + deletedFolders.length} 个项目</p>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2 p-4"
        >
          {/* 已删除的文件夹 */}
          {deletedFolders.map((folder, index) => (
            <TrashItem
              key={folder.id}
              item={folder}
              index={index}
              onRestore={() => restoreFolder(folder.id, undefined)}
              onPermanentDelete={() => permanentDeleteFolder(folder.id)}
            />
          ))}

          {/* 已删除的笔记 */}
          {deletedNotes.map((note, index) => (
            <TrashItem
              key={note.id}
              item={note}
              index={index}
              offset={deletedFolders.length}
              onRestore={() => handleRestoreNote(note)}
              onPermanentDelete={() => permanentDeleteNote(note.id)}
            />
          ))}

          {/* 空状态 */}
          {deletedNotes.length === 0 && deletedFolders.length === 0 && <EmptyTrash />}
        </motion.div>
      </div>

      {/* 恢复对话框 */}
      <RestoreDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen} item={selectedNote} />
    </motion.div>
  );
}
