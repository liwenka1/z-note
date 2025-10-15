import { FolderOpen, Search, Settings, BookOpen, Tag, BarChart3, MessageSquare, Globe } from "lucide-react";

// 左侧活动栏按钮配置
export const leftActivityButtons = [
  { id: "files", icon: FolderOpen, tooltip: "笔记" },
  { id: "tags", icon: Tag, tooltip: "标签管理" },
  { id: "search", icon: Search, tooltip: "搜索" }
];

// 左侧底部按钮配置
export const leftBottomButtons = [{ id: "settings", icon: Settings, tooltip: "设置" }];

// 右侧活动栏按钮配置
export const rightActivityButtons = [
  { id: "chat", icon: MessageSquare, tooltip: "AI 助手" },
  { id: "playground", icon: Globe, tooltip: "AI 工作台" },
  { id: "outline", icon: BookOpen, tooltip: "文档大纲" },
  { id: "stats", icon: BarChart3, tooltip: "统计信息" }
];
