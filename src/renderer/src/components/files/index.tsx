import { motion } from "framer-motion";
import { FilesHeader } from "./components/files-header";
import { FolderTree } from "./components/folder-tree";
import { EmptyFiles } from "./components/empty-files";
import { useFilesState } from "./hooks/use-files-state";

/**
 * Files 主组件
 * 参考 chat 的模式，组合所有子组件
 */
export function FilesPanel() {
  const { hasContent } = useFilesState();

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
