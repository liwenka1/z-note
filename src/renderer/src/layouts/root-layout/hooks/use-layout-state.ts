import { useState } from "react";
import { useSearchStore } from "@renderer/stores";
import { useTabStore } from "@renderer/stores";

export function useLayoutState() {
  const { openSearch } = useSearchStore();
  const { openSettingsTab } = useTabStore();

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightActivePanel, setRightActivePanel] = useState<string | null>(null);

  // 切换左侧边栏
  const toggleLeftSidebar = (panelId: string) => {
    if (panelId === "search") {
      // 搜索做特殊处理，直接打开搜索弹窗
      openSearch();
    } else {
      // 其他面板使用通用切换逻辑
      if (activePanel === panelId && leftSidebarOpen) {
        // 如果当前面板已激活且边栏已打开，则关闭
        setLeftSidebarOpen(false);
        setActivePanel(null);
      } else {
        // 否则打开对应面板
        setLeftSidebarOpen(true);
        setActivePanel(panelId);
      }
    }
  };

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    openSettingsTab();
  };

  // 切换右侧边栏
  const toggleRightSidebar = (panelId: string) => {
    // 通用的切换逻辑，支持所有右侧面板
    if (rightActivePanel === panelId && rightSidebarOpen) {
      // 如果当前面板已激活且边栏已打开，则关闭
      setRightSidebarOpen(false);
      setRightActivePanel(null);
    } else {
      // 否则打开对应面板
      setRightSidebarOpen(true);
      setRightActivePanel(panelId);
    }
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
