import { motion } from "framer-motion";
import { useTrashState } from "./hooks/use-trash-state";
import { RestoreDialog } from "./components/restore-dialog";
import { TrashItem } from "./components/trash-item";
import { EmptyTrash } from "./components/empty-trash";

export function TrashPanel() {
  const {
    deletedNotes,
    deletedFolders,
    restoreDialogOpen,
    selectedNote,
    handleRestoreFolder,
    handlePermanentDeleteNote,
    handlePermanentDeleteFolder,
    openRestoreDialog,
    closeRestoreDialog
  } = useTrashState();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* 标题栏 */}
      <div className="border-border/50 bg-secondary/30 border-b px-4 py-3">
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
              onRestore={() => handleRestoreFolder(folder)}
              onPermanentDelete={() => handlePermanentDeleteFolder(folder)}
            />
          ))}

          {/* 已删除的笔记 */}
          {deletedNotes.map((note, index) => (
            <TrashItem
              key={note.id}
              item={note}
              index={index}
              offset={deletedFolders.length}
              onRestore={() => openRestoreDialog(note)}
              onPermanentDelete={() => handlePermanentDeleteNote(note)}
            />
          ))}

          {/* 空状态 */}
          {deletedNotes.length === 0 && deletedFolders.length === 0 && <EmptyTrash />}
        </motion.div>
      </div>

      {/* 恢复对话框 */}
      <RestoreDialog open={restoreDialogOpen} onOpenChange={closeRestoreDialog} item={selectedNote} />
    </motion.div>
  );
}
