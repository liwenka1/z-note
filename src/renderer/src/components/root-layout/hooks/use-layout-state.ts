import { useState } from "react";
import { useSearchStore } from "@renderer/stores";
import { useTabStore } from "@renderer/stores/tab-store";

export function useLayoutState() {
  const { openSearch } = useSearchStore();
  const { openSettingsTab } = useTabStore();

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightActivePanel, setRightActivePanel] = useState<string | null>(null);

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
    } else if (panelId === "trash") {
      // 垃圾桶改为侧边栏模式
      if (activePanel === "trash" && leftSidebarOpen) {
        setLeftSidebarOpen(false);
        setActivePanel(null);
      } else {
        setLeftSidebarOpen(true);
        setActivePanel("trash");
      }
    }
  };

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    openSettingsTab();
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
    // 右侧按钮都已实现相应功能
  };

  return {
    // 状态
    leftSidebarOpen,
    activePanel,
    rightSidebarOpen,
    rightActivePanel,

    // 操作函数
    toggleLeftSidebar,
    toggleRightSidebar,
    handleSettingsClick
  };
}
