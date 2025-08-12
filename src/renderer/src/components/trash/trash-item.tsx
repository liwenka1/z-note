import { motion } from "framer-motion";
import { Button } from "@renderer/components/ui/button";
import { FolderIcon, FileTextIcon, RotateCcw } from "lucide-react";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import type { Note, Folder } from "@renderer/types";

interface TrashItemProps {
  item: Note | Folder;
  index: number;
  offset?: number;
  onRestore: () => void;
  onPermanentDelete: () => void;
}

export function TrashItem({ item, index, offset = 0, onRestore, onPermanentDelete }: TrashItemProps) {
  const isFolder = "name" in item;
  const displayName = isFolder ? (item as Folder).name : (item as Note).title;
  const itemType = isFolder ? "文件夹" : "笔记";

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: (offset + index) * 0.05 }}
      className="hover:bg-muted/50 flex items-center justify-between rounded p-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {isFolder ? (
          <FolderIcon size={16} className="text-muted-foreground flex-shrink-0" />
        ) : (
          <FileTextIcon size={16} className="text-muted-foreground flex-shrink-0" />
        )}
        <span className="truncate text-sm">{displayName}</span>
        <span className="text-muted-foreground flex-shrink-0 text-xs">
          {isFolder ? `(文件夹 - ${item.updatedAt.toLocaleDateString()})` : `(${item.updatedAt.toLocaleDateString()})`}
        </span>
      </div>
      <div className="ml-2 flex flex-shrink-0 gap-1">
        <Button size="sm" variant="ghost" onClick={onRestore} className="h-6 w-6 p-0" title={`恢复${itemType}`}>
          <RotateCcw size={12} />
        </Button>
        <DeleteConfirmDialog itemName={displayName} itemType={itemType} onConfirm={onPermanentDelete} />
      </div>
    </motion.div>
  );
}
