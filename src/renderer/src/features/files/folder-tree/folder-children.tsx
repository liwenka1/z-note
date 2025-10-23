import { motion, AnimatePresence } from "framer-motion";
import { NoteItem } from "../note-item";
import type { FileNode } from "@shared/types";

interface FolderChildrenProps {
  childNodes: FileNode[];
  level: number;
  isExpanded: boolean;
  renderFolder: (folder: FileNode, level: number) => React.ReactNode;
}

/**
 * 文件夹子项渲染组件
 * 负责递归渲染文件夹的子文件和子文件夹
 */
export function FolderChildren({ childNodes, level, isExpanded, renderFolder }: FolderChildrenProps) {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            opacity: { duration: 0.2 }
          }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              delay: 0.1
            }}
          >
            {childNodes.map((child) => (
              <div key={child.path}>
                {child.isDirectory ? renderFolder(child, level + 1) : <NoteItem file={child} level={level + 1} />}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
