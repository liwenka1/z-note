import { motion } from "framer-motion";
import { FilesHeader } from "./components/files-header";
import { FolderTree } from "./components/folder-tree";
import { EmptyFiles } from "./components/empty-files";
import { useFilesState } from "./hooks/use-files-state";
import { FILES_ANIMATION, FILES_CLASSES } from "./constants/files";

/**
 * Files 主组件
 * 参考 chat 的模式，组合所有子组件
 */
export function FilesPanel() {
  const { hasContent } = useFilesState();

  return (
    <motion.div {...FILES_ANIMATION} className={FILES_CLASSES.PANEL}>
      <FilesHeader />

      <div className={FILES_CLASSES.CONTENT}>{hasContent ? <FolderTree /> : <EmptyFiles />}</div>
    </motion.div>
  );
}
