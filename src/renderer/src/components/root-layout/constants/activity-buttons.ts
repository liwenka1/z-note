import { FolderOpen, Search, Settings, Trash, BookOpen, Tag, BarChart3, MessageSquare } from "lucide-react";

// 左侧活动栏按钮配置
export const leftActivityButtons = [
  { id: "files", icon: FolderOpen, tooltip: "笔记 (Ctrl+Shift+E)" }
  // { id: "search", icon: Search, tooltip: "搜索 (Ctrl+Shift+F)" }
  // { id: "trash", icon: Trash, tooltip: "回收站" }
];

// 左侧底部按钮配置
export const leftBottomButtons = [{ id: "settings", icon: Settings, tooltip: "设置" }];

// 右侧活动栏按钮配置
export const rightActivityButtons = [
  { id: "chat", icon: MessageSquare, tooltip: "AI 助手", badge: 0 },
  { id: "outline", icon: BookOpen, tooltip: "文档大纲" },
  { id: "tags", icon: Tag, tooltip: "标签管理" },
  { id: "stats", icon: BarChart3, tooltip: "统计信息" }
];
