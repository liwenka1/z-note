import { motion } from "framer-motion";
import { ChevronRight, Folder as FolderIcon, FolderOpen } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";

interface FolderHeaderProps {
  name: string;
  isExpanded: boolean;
  level: number;
  onToggleExpand: () => void;
}

/**
 * 文件夹头部组件
 * 负责显示展开/折叠按钮、图标和名称
 */
export function FolderHeader({ name, isExpanded, level, onToggleExpand }: FolderHeaderProps) {
  return (
    <div className={cn("flex flex-1 cursor-pointer items-center text-sm")} style={{ paddingLeft: `${level * 20}px` }}>
      {/* 展开/折叠按钮 */}
      <motion.div
        className={cn("flex h-5 w-5 items-center justify-center")}
        animate={{ rotate: isExpanded ? 90 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Button variant="ghost" size="sm" className={cn("hover:bg-muted h-5 w-5 p-0")} onClick={onToggleExpand}>
          <ChevronRight className={cn("h-3 w-3")} />
        </Button>
      </motion.div>

      {/* 文件夹图标 */}
      <div className={cn("ml-1 shrink-0")}>
        {isExpanded ? (
          <FolderOpen className={cn("text-muted-foreground h-4 w-4")} />
        ) : (
          <FolderIcon className={cn("text-muted-foreground h-4 w-4")} />
        )}
      </div>

      {/* 文件夹名称 */}
      <div className={cn("min-w-0 flex-1")}>
        <span className={cn("block truncate font-medium")} title={name}>
          {name}
        </span>
      </div>
    </div>
  );
}
