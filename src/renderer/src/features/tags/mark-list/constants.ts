import { FileText, Image, Link, File, ScanLine, type LucideIcon } from "lucide-react";

export interface MarkTypeConfig {
  icon: LucideIcon;
  color: string;
  label: string;
  createLabel: string;
}

export const MARK_TYPE_CONFIG: Record<string, MarkTypeConfig> = {
  text: {
    icon: FileText,
    color: "text-blue-500",
    label: "文本",
    createLabel: "添加文本记录"
  },
  link: {
    icon: Link,
    color: "text-purple-500",
    label: "链接",
    createLabel: "添加链接记录"
  },
  image: {
    icon: Image,
    color: "text-green-500",
    label: "图片",
    createLabel: "添加图片记录"
  },
  file: {
    icon: File,
    color: "text-orange-500",
    label: "文件",
    createLabel: "添加文件记录"
  },
  scan: {
    icon: ScanLine,
    color: "text-pink-500",
    label: "扫描",
    createLabel: "添加扫描记录"
  }
};
