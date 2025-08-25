import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export function EmptyTrash() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="py-8 text-center"
    >
      <Trash2 className="text-muted-foreground/50 mx-auto h-8 w-8" />
      <p className="text-muted-foreground mt-2 text-sm">回收站为空</p>
      <p className="text-muted-foreground mt-1 text-xs">删除的笔记和文件夹会出现在这里</p>
    </motion.div>
  );
}
