import { motion } from "framer-motion";
import { ChevronRight, Folder as FolderIcon, FolderOpen } from "lucide-react";
import { Button } from "@renderer/components/ui/button";

interface FolderHeaderProps {
  name: string;
  isExpanded: boolean;
  level: number;
  onToggleExpand: (e: React.MouseEvent) => void;
}

/**
 * 文件夹头部组件
 * 负责显示展开/折叠按钮、图标和名称
 */
export function FolderHeader({ name, isExpanded, level, onToggleExpand }: FolderHeaderProps) {
  return (
    <div className="flex flex-1 items-center" style={{ paddingLeft: `${level * 20}px` }}>
      <motion.div
        className="flex h-5 w-5 shrink-0 items-center justify-center"
        animate={{ rotate: isExpanded ? 90 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Button variant="ghost" size="sm" className="hover:bg-muted h-5 w-5 p-0" onClick={onToggleExpand}>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </motion.div>

      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="shrink-0">
          {isExpanded ? (
            <FolderOpen className="text-muted-foreground h-4 w-4" />
          ) : (
            <FolderIcon className="text-muted-foreground h-4 w-4" />
          )}
        </div>

        <span className="block truncate" title={name}>
          {name}
        </span>
      </div>
    </div>
  );
}
