/**
 * Editor 相关常量配置
 * 参考 chat 的 constants 模式
 */

// 样式类名
export const EDITOR_CLASSES = {
  CONTAINER: "bg-background h-full w-full overflow-auto",
  NOT_FOUND_CONTAINER: "bg-background flex h-full flex-col",
  NOT_FOUND_HEADER: "border-border bg-background border-b p-4",
  TIPTAP_CONTAINER: "bg-background min-h-full"
} as const;

// TipTap 编辑器配置
export const TIPTAP_CONFIG = {
  DEFAULT_PLACEHOLDER: "开始写作...",
  EDITOR_PROPS_CLASS: "focus:outline-none prose prose-neutral dark:prose-invert max-w-none p-6",
  LINK_CLASS: "text-primary underline-offset-4 hover:underline"
} as const;

// 工具栏配置
export const TOOLBAR_CONFIG = {
  BUTTON_SIZE: "h-8 w-8 p-0",
  HEADING_BUTTON_SIZE: "h-8 px-2",
  SEPARATOR_HEIGHT: "h-6",
  CONTAINER_CLASS: "flex flex-wrap items-center justify-center gap-1 border-b p-1"
} as const;

// 图标大小
export const EDITOR_CONSTANTS = {
  ICON_SIZE: "h-4 w-4"
} as const;
