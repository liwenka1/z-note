import { motion } from "framer-motion";
import { FilesHeader } from "./files-header";
import { FolderTree } from "./folder-tree";
import { EmptyFiles } from "./empty-files";
import { useNotesStore } from "@renderer/store";

export function FilesPanel() {
  const { folders, notes } = useNotesStore();

  // 检查是否有活跃的文件或文件夹
  const activeFolders = folders.filter((f) => !f.isDeleted);
  const activeNotes = notes.filter((n) => !n.isDeleted);
  const hasContent = activeFolders.length > 0 || activeNotes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-background flex h-full flex-col"
    >
      <FilesHeader />

      <div className="flex-1 overflow-hidden">{hasContent ? <FolderTree /> : <EmptyFiles />}</div>
    </motion.div>
  );
}
