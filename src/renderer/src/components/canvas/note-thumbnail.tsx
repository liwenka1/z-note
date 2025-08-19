import { memo } from "react";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { NoteData } from "./infinite-canvas";
import { cn } from "@renderer/lib/utils";

interface NoteThumbnailProps {
  note: NoteData;
  index: number;
  onOpen: (noteId: string) => void;
  angle: number; // 笔记在圆形布局中的角度
  distance: number; // 距离中心的距离
}

export const NoteThumbnail = memo(function NoteThumbnail({ note, index, onOpen, angle, distance }: NoteThumbnailProps) {
  // 计算笔记在圆形布局中的位置
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  // 动画变体配置
  const variants = {
    hidden: {
      scale: 0,
      opacity: 0,
      x: 0,
      y: 0,
      rotate: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      x,
      y,
      rotate: Math.random() * 8 - 4, // 随机轻微旋转，减少幅度
      transition: {
        type: "spring" as const,
        damping: 25, // 增加阻尼，减少弹跳
        stiffness: 280, // 稍微降低弹性
        delay: Math.min(index * 0.08, 0.6), // 错开动画时间，但限制最大延迟
        duration: 0.6 // 限制动画时长
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      x: x * 0.3, // 部分回缩
      y: y * 0.3,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 35,
        stiffness: 450,
        delay: Math.max((8 - index) * 0.03, 0), // 反向错开收起动画，但不超过8个
        duration: 0.4
      }
    },
    hover: {
      scale: 1.08, // 稍微减少悬停缩放
      rotate: 0,
      z: 10, // 添加z轴变化
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 400,
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 500,
        duration: 0.1
      }
    }
  };

  const previewContent =
    note.content && note.content.length > 50 ? `${note.content.slice(0, 50)}...` : note.content || "";

  return (
    <motion.div
      className="pointer-events-auto absolute"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onOpen(note.id)}
      style={{
        transformOrigin: "center center",
        zIndex: 40 // 确保在所有元素之上
      }}
      drag
      dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
    >
      <div
        className={cn(
          "bg-background border-border max-w-[180px] min-w-[160px] cursor-pointer rounded-lg border-2 shadow-lg",
          "hover:border-primary/50 transition-colors duration-200 hover:shadow-xl",
          "transform-gpu" // 启用GPU加速
        )}
      >
        {/* 缩略图 */}
        {note.thumbnail && (
          <div className="border-border h-20 w-full overflow-hidden rounded-t-md border-b">
            <img
              src={note.thumbnail}
              alt={note.title}
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-3">
          {/* 标题 */}
          <h4 className="mb-2 truncate text-sm font-medium">{note.title}</h4>

          {/* 内容预览 */}
          {previewContent && (
            <p className="text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed">{previewContent}</p>
          )}

          {/* 底部信息 */}
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              笔记
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(note.lastModified, "MM/dd", { locale: zhCN })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
