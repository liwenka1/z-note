/**
 * 布局尺寸常量定义
 * 避免在组件中使用硬编码数值
 */
export const LAYOUT_CONSTANTS = {
  // 状态栏高度
  STATUS_BAR_HEIGHT: 24,
  // 活动栏宽度
  ACTIVITY_BAR_WIDTH: 40,
  // 侧边栏默认宽度
  LEFT_SIDEBAR_DEFAULT_WIDTH: 300,
  RIGHT_SIDEBAR_DEFAULT_WIDTH: 350
} as const;

/**
 * 预定义的 CSS 类名（确保 Tailwind 能正确识别）
 */
export const LAYOUT_CLASSES = {
  // 主内容区域高度
  MAIN_CONTENT_HEIGHT: "h-[calc(100vh-24px)]"
} as const;

/**
 * 活动栏配置对象
 */
export const ACTIVITY_BAR_CONFIG = {
  minSize: LAYOUT_CONSTANTS.ACTIVITY_BAR_WIDTH,
  maxSize: LAYOUT_CONSTANTS.ACTIVITY_BAR_WIDTH
} as const;
