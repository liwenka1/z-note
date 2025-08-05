import { Outlet, useNavigate } from "@tanstack/react-router";
import { FolderOpen, Search, FileText, Settings, Trash, BookOpen, Tag, BarChart3 } from "lucide-react";
import { useState } from "react";

import { SearchCommand } from "@renderer/components/search-command";
import { SimpleNotesList } from "@renderer/components/simple-notes-list";
import { StatusBar } from "@renderer/components/status-bar";
import { useNotesStore, useSearchStore } from "@renderer/store";
import { useEffect } from "react";
import { cn } from "@renderer/lib/utils";

// 活动栏按钮配置
const leftActivityButtons = [
  { id: "files", icon: FolderOpen, tooltip: "文件资源管理器 (Ctrl+Shift+E)" },
  { id: "search", icon: Search, tooltip: "搜索 (Ctrl+Shift+F)" },
  { id: "recent", icon: FileText, tooltip: "最近文档" },
  { id: "settings", icon: Settings, tooltip: "设置" },
  { id: "trash", icon: Trash, tooltip: "回收站" }
];

const rightActivityButtons = [
  { id: "outline", icon: BookOpen, tooltip: "文档大纲" },
  { id: "tags", icon: Tag, tooltip: "标签管理" },
  { id: "stats", icon: BarChart3, tooltip: "统计信息" }
];

export function RootLayout() {
  const { initializeData } = useNotesStore();
  const { openSearch } = useSearchStore();
  const navigate = useNavigate();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // 切换侧边栏
  const toggleSidebar = (panelId: string) => {
    if (panelId === "files") {
      if (activePanel === "files" && leftSidebarOpen) {
        setLeftSidebarOpen(false);
        setActivePanel(null);
      } else {
        setLeftSidebarOpen(true);
        setActivePanel("files");
      }
    } else if (panelId === "search") {
      // 搜索
      openSearch();
    } else if (panelId === "settings") {
      // 跳转到设置页面
      navigate({ to: "/settings" });
      // 关闭侧边栏
      setLeftSidebarOpen(false);
      setActivePanel(null);
    } else if (panelId === "trash") {
      // 跳转到回收站页面
      navigate({ to: "/trash" });
      // 关闭侧边栏
      setLeftSidebarOpen(false);
      setActivePanel(null);
    } else if (panelId === "recent") {
      // 跳转到首页（最近文档）
      navigate({ to: "/" });
      // 关闭侧边栏
      setLeftSidebarOpen(false);
      setActivePanel(null);
    }
    // 右侧按钮（outline、tags、stats）暂时无行为
  };

  return (
    <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
      {/* 上半部分：活动栏 + 侧边栏 + 主内容 */}
      <div className="flex h-[calc(100vh-24px)]">
        {/* 左侧活动栏 */}
        <div className="bg-secondary/30 flex w-12 flex-col border-r">
          <div className="flex flex-1 flex-col items-center gap-1 py-2">
            {leftActivityButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => toggleSidebar(button.id)}
                className={cn(
                  "text-muted-foreground hover:bg-secondary hover:text-foreground flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                  activePanel === button.id && "bg-secondary text-foreground"
                )}
                title={button.tooltip}
              >
                <button.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* 左侧边栏 */}
        {leftSidebarOpen && activePanel === "files" && (
          <div className="bg-secondary/30 h-full w-80 border-r">
            <SimpleNotesList />
          </div>
        )}

        {/* 主内容区域 */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>

        {/* 右侧活动栏 */}
        <div className="bg-secondary/30 flex w-12 flex-col border-l">
          <div className="flex flex-1 flex-col items-center gap-1 py-2">
            {rightActivityButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => toggleSidebar(button.id)}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground flex h-10 w-10 items-center justify-center rounded-md transition-colors"
                title={button.tooltip}
              >
                <button.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部状态栏 - 占满整个底部 */}
      <StatusBar />

      {/* 搜索弹窗 */}
      <SearchCommand />
    </div>
  );
}
