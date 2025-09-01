/**
 * Files 相关常量配置
 */

// 动画配置
export const FILES_ANIMATION = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2 }
} as const;

// 样式类名
export const FILES_CLASSES = {
  PANEL: "bg-background flex h-full flex-col",
  HEADER: "border-border/50 bg-secondary/30 flex h-11 items-center justify-between border-b px-4",
  CONTENT: "flex-1 overflow-hidden",
  BUTTON_ICON: "h-7 w-7 p-0"
} as const;

// UI 常量
export const FILES_CONSTANTS = {
  ICON_SIZE: "h-4 w-4",
  FOLDER_ICON_SIZE: "h-4 w-4",
  NOTE_ICON_SIZE: "h-4 w-4"
} as const;
