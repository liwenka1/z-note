import { useNavigate } from "@tanstack/react-router";
import { FolderOpen, Search, FileText, Settings, Trash, BookOpen, Tag, BarChart3, MessageSquare } from "lucide-react";
import { useState } from "react";

import { SearchCommand } from "@renderer/components/search-command";
import { FilesPanel } from "@renderer/components/files/files-panel";
import { StatusBar } from "@renderer/components/status-bar";
import { ChatPanel } from "@renderer/components/chat/chat-panel";
import { EditorLayout } from "@renderer/components/editor/editor-layout";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@renderer/components/ui/resizable";
import { useNotesStore, useSearchStore } from "@renderer/store";
import { useChatStore } from "@renderer/store/chat-store";
import { useEffect } from "react";
import { cn } from "@renderer/lib/utils";

// 活动栏按钮配置
const leftActivityButtons = [
  { id: "files", icon: FolderOpen, tooltip: "笔记 (Ctrl+Shift+E)" },
  { id: "search", icon: Search, tooltip: "搜索 (Ctrl+Shift+F)" },
  { id: "recent", icon: FileText, tooltip: "最近文档" },
  { id: "settings", icon: Settings, tooltip: "设置" },
  { id: "trash", icon: Trash, tooltip: "回收站" }
];

const rightActivityButtons = [
  { id: "chat", icon: MessageSquare, tooltip: "AI 助手", badge: 0 },
  { id: "outline", icon: BookOpen, tooltip: "文档大纲" },
  { id: "tags", icon: Tag, tooltip: "标签管理" },
  { id: "stats", icon: BarChart3, tooltip: "统计信息" }
];

export function RootLayout() {
  const { initializeData } = useNotesStore();
  const { openSearch } = useSearchStore();
  const { sessions } = useChatStore();
  const navigate = useNavigate();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightActivePanel, setRightActivePanel] = useState<string | null>(null);
  const [dockVisible, setDockVisible] = useState(true);

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // 切换停靠栏显示/隐藏
  const toggleDock = () => {
    setDockVisible(!dockVisible);
  };

  // 切换左侧边栏
  const toggleLeftSidebar = (panelId: string) => {
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
  };

  // 切换右侧边栏
  const toggleRightSidebar = (panelId: string) => {
    if (panelId === "chat") {
      if (rightActivePanel === "chat" && rightSidebarOpen) {
        setRightSidebarOpen(false);
        setRightActivePanel(null);
      } else {
        setRightSidebarOpen(true);
        setRightActivePanel("chat");
      }
    } else if (panelId === "outline") {
      if (rightActivePanel === "outline" && rightSidebarOpen) {
        setRightSidebarOpen(false);
        setRightActivePanel(null);
      } else {
        setRightSidebarOpen(true);
        setRightActivePanel("outline");
      }
    }
    // 其他右侧按钮（tags、stats）暂时无行为
  };

  return (
    <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
      {/* 上半部分：活动栏 + 侧边栏 + 主内容 */}
      <div className="flex h-[calc(100vh-24px)]">
        {/* 左侧活动栏 */}
        {dockVisible && (
          <div className="bg-secondary/30 flex w-10 flex-col border-r">
            <div className="flex flex-1 flex-col items-center gap-1 py-2">
              {leftActivityButtons.map((button) => (
                <Tooltip key={button.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleLeftSidebar(button.id)}
                      className={cn(
                        "text-muted-foreground hover:bg-secondary hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                        activePanel === button.id && "bg-secondary text-foreground"
                      )}
                    >
                      <button.icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{button.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* 主内容区域 - 包含左侧面板、主内容和右侧面板 */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* 左侧边栏面板 */}
          {dockVisible && leftSidebarOpen && activePanel === "files" && (
            <>
              <ResizablePanel id="left-sidebar" defaultSize={15} minSize={10} maxSize={50} order={1}>
                <div className="bg-secondary/20 border-border/50 h-full border-r">
                  <FilesPanel />
                </div>
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          {/* 主内容区域 */}
          <ResizablePanel id="main-content" minSize={30} order={2}>
            <div className="h-full overflow-hidden">
              <EditorLayout />
            </div>
          </ResizablePanel>

          {/* 右侧面板内容 */}
          {dockVisible && rightSidebarOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel id="right-sidebar" defaultSize={25} minSize={20} maxSize={50} order={3}>
                <div className="bg-secondary/20 border-border/50 h-full border-l">
                  {rightActivePanel === "chat" && <ChatPanel />}
                  {rightActivePanel === "outline" && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium">文档大纲</h3>
                      <p className="text-muted-foreground mt-2 text-xs">功能开发中...</p>
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* 右侧活动栏 */}
        {dockVisible && (
          <div className="bg-secondary/30 flex w-10 flex-col border-l">
            <div className="flex flex-1 flex-col items-center gap-1 py-2">
              {rightActivityButtons.map((button) => (
                <Tooltip key={button.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleRightSidebar(button.id)}
                      className={cn(
                        "text-muted-foreground hover:bg-secondary hover:text-foreground relative flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                        rightActivePanel === button.id && "bg-secondary text-foreground"
                      )}
                    >
                      <button.icon className="h-5 w-5" />
                      {/* 显示徽章（如未读消息数） */}
                      {button.id === "chat" && sessions.length > 0 && (
                        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full text-[10px]">
                          {sessions.length > 9 ? "9+" : sessions.length}
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{button.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 - 占满整个底部 */}
      <StatusBar onToggleDock={toggleDock} isDockVisible={dockVisible} />

      {/* 搜索弹窗 */}
      <SearchCommand />
    </div>
  );
}
