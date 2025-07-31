export interface SearchItem {
  id: string;
  title: string;
  type: "note" | "page" | "folder";
  icon: string;
  path?: string;
  description?: string;
}

export const searchData: SearchItem[] = [
  // 笔记
  {
    id: "note-1",
    title: "我的第一篇笔记",
    type: "note",
    icon: "📄",
    description: "这是我创建的第一篇笔记，记录了一些想法..."
  },
  {
    id: "note-2",
    title: "工作日志",
    type: "note",
    icon: "📄",
    description: "记录每日工作内容和进展"
  },
  {
    id: "note-3",
    title: "学习笔记",
    type: "note",
    icon: "📄",
    description: "React 和 TypeScript 学习记录"
  },
  {
    id: "note-4",
    title: "项目规划",
    type: "note",
    icon: "📄",
    description: "Z-Note 项目的开发计划和功能规划"
  },

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
  },

  // 文件夹
  {
    id: "folder-1",
    title: "工作文件夹",
    type: "folder",
    icon: "📁",
    description: "存放工作相关的笔记和文档"
  },
  {
    id: "folder-2",
    title: "学习资料",
    type: "folder",
    icon: "📁",
    description: "技术学习和知识管理"
  },
  {
    id: "folder-3",
    title: "个人笔记",
    type: "folder",
    icon: "📁",
    description: "个人想法和生活记录"
  }
];

// 按类型分组的数据
export const getGroupedSearchData = () => ({
  notes: searchData.filter((item) => item.type === "note"),
  pages: searchData.filter((item) => item.type === "page"),
  folders: searchData.filter((item) => item.type === "folder")
});
