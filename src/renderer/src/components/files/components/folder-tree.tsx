import { useEffect } from "react";
import { motion } from "framer-motion";
import { useFilesState } from "../hooks/use-files-state";
import { FolderItem } from "./folder-item";
import { NoteItem } from "./note-item";
import type { FileNode } from "@renderer/types/files";

/**
 * 递归渲染文件树节点
 */
function renderFileNode(node: FileNode, level: number = 0): React.ReactNode {
  const key = `${node.path}-${level}`;

  if (node.isDirectory) {
    return <FolderItem key={key} folder={node} level={level} />;
  } else {
    return <NoteItem key={key} file={node} level={level} />;
  }
}

/**
 * 文件树组件
 * 支持嵌套显示文件夹和文件
 */
export function FolderTree() {
  const { fileTree, hasContent, isLoading, loadFileTree } = useFilesState();

  // 初始化时加载文件树
  useEffect(() => {
    loadFileTree();
  }, [loadFileTree]);

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">加载中...</div>
      </div>
    );
  }

  // 空状态
  if (!hasContent) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">暂无文件</div>
      </div>
    );
  }

  // 文件树显示
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full overflow-auto"
    >
      <div className="space-y-0.5 p-2">{fileTree.map((node) => renderFileNode(node, 0))}</div>
    </motion.div>
  );
}
