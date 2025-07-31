import { mockData } from "./mock-data";

export interface SearchItem {
  id: string;
  title: string;
  type: "note" | "page" | "folder";
  icon: string;
  path?: string;
  description?: string;
}

// 从模拟数据生成搜索数据
export const searchData: SearchItem[] = [
  // 笔记数据
  ...mockData.notes
    .filter((note) => !note.isDeleted)
    .map((note) => ({
      id: note.id,
      title: note.title,
      type: "note" as const,
      icon: "📄",
      description: note.excerpt || note.content.slice(0, 100) + "..."
    })),

  // 文件夹数据
  ...mockData.folders
    .filter((folder) => !folder.isDeleted)
    .map((folder) => ({
      id: folder.id,
      title: folder.name,
      type: "folder" as const,
      icon: folder.icon || "📁",
      description: folder.description
    })),

  // 页面
  {
    id: "page-1",
    title: "主页",
    type: "page",
    icon: "🏠",
    path: "/",
    description: "应用的首页和欢迎页面"
  },
  {
    id: "page-2",
    title: "设置",
    type: "page",
    icon: "⚙️",
    path: "/settings",
    description: "应用设置和个人偏好"
  },
  {
    id: "page-3",
    title: "垃圾箱",
    type: "page",
    icon: "🗑️",
    path: "/trash",
    description: "已删除的笔记和文件夹"
  }
];

// 按类型分组的数据
export const getGroupedSearchData = () => ({
  notes: searchData.filter((item) => item.type === "note"),
  pages: searchData.filter((item) => item.type === "page"),
  folders: searchData.filter((item) => item.type === "folder")
});
