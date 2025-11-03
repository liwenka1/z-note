/**
 * 编辑器颜色预设
 *
 * 设计原则：
 * - 文本颜色：深色系，确保可读性
 * - 背景高亮：浅色系，不影响文本阅读
 * - 两者颜色不重复，各司其职
 */

export interface ColorPreset {
  name: string;
  value: string;
  displayColor: string;
}

/**
 * 文本颜色预设
 * 特点：深色、高饱和度、清晰可读
 */
export const TEXT_COLORS: ColorPreset[] = [
  { name: "默认", value: "", displayColor: "currentColor" },
  { name: "深灰", value: "#374151", displayColor: "#374151" }, // Gray-700
  { name: "黑色", value: "#000000", displayColor: "#000000" },
  { name: "深红", value: "#DC2626", displayColor: "#DC2626" }, // Red-600
  { name: "深橙", value: "#EA580C", displayColor: "#EA580C" }, // Orange-600
  { name: "深黄", value: "#CA8A04", displayColor: "#CA8A04" }, // Yellow-600
  { name: "深绿", value: "#16A34A", displayColor: "#16A34A" }, // Green-600
  { name: "深青", value: "#0891B2", displayColor: "#0891B2" }, // Cyan-600
  { name: "深蓝", value: "#2563EB", displayColor: "#2563EB" }, // Blue-600
  { name: "深紫", value: "#9333EA", displayColor: "#9333EA" }, // Purple-600
  { name: "深粉", value: "#DB2777", displayColor: "#DB2777" }, // Pink-600
  { name: "棕色", value: "#92400E", displayColor: "#92400E" } // Amber-800
];

/**
 * 背景高亮颜色预设
 * 特点：浅色、低饱和度、像荧光笔
 */
export const HIGHLIGHT_COLORS: ColorPreset[] = [
  { name: "清除", value: "", displayColor: "transparent" },
  { name: "黄色", value: "#FEF08A", displayColor: "#FEF08A" }, // Yellow-200
  { name: "绿色", value: "#BBF7D0", displayColor: "#BBF7D0" }, // Green-200
  { name: "蓝色", value: "#BFDBFE", displayColor: "#BFDBFE" }, // Blue-200
  { name: "红色", value: "#FECACA", displayColor: "#FECACA" }, // Red-200
  { name: "紫色", value: "#E9D5FF", displayColor: "#E9D5FF" }, // Purple-200
  { name: "橙色", value: "#FED7AA", displayColor: "#FED7AA" }, // Orange-200
  { name: "粉色", value: "#FBCFE8", displayColor: "#FBCFE8" }, // Pink-200
  { name: "青色", value: "#A5F3FC", displayColor: "#A5F3FC" }, // Cyan-200
  { name: "灰色", value: "#E5E7EB", displayColor: "#E5E7EB" } // Gray-200
];
