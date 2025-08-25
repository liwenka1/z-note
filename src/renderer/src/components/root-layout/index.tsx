import { useEffect } from "react";
import { Allotment, LayoutPriority } from "allotment";
import "allotment/dist/style.css";

import { SearchCommand } from "@renderer/components/search-command";
import { StatusBar } from "@renderer/components/status-bar";
import { EditorLayout } from "@renderer/components/root-layout/components/editor-layout";
import { useNotesStore } from "@renderer/store";
import { useChatStore } from "@renderer/store/chat-store";
import { LAYOUT_CONSTANTS, LAYOUT_CLASSES, ACTIVITY_BAR_CONFIG } from "./constants/layout";

import { LeftActivityBar } from "./components/left-activity-bar";
import { RightActivityBar } from "./components/right-activity-bar";
import { LeftSidebar } from "./components/left-sidebar";
import { RightSidebar } from "./components/right-sidebar";
import { useLayoutState } from "./hooks/use-layout-state";

export function RootLayout() {
  const { initializeData } = useNotesStore();
  const { sessions } = useChatStore();

  const {
    leftSidebarOpen,
    activePanel,
    rightSidebarOpen,
    rightActivePanel,
    toggleLeftSidebar,
    toggleRightSidebar,
    handleSettingsClick
  } = useLayoutState();

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
      {/* 主要布局区域 - 使用 Allotment，预留 StatusBar 空间 */}
      <div className={LAYOUT_CLASSES.MAIN_CONTENT_HEIGHT}>
        <Allotment proportionalLayout={false}>
          {/* 左侧活动栏 - 固定宽度 */}
          <Allotment.Pane minSize={ACTIVITY_BAR_CONFIG.minSize} maxSize={ACTIVITY_BAR_CONFIG.maxSize}>
            <LeftActivityBar
              activePanel={activePanel}
              onToggleLeftSidebar={toggleLeftSidebar}
              onSettingsClick={handleSettingsClick}
            />
          </Allotment.Pane>

          {/* 左侧面板 - 可收起 */}
          <Allotment.Pane
            preferredSize={LAYOUT_CONSTANTS.LEFT_SIDEBAR_DEFAULT_WIDTH}
            priority={LayoutPriority.Low}
            snap
            visible={leftSidebarOpen}
          >
            <LeftSidebar activePanel={activePanel} />
          </Allotment.Pane>

          {/* 主内容区 - 高优先级 */}
          <Allotment.Pane priority={LayoutPriority.High}>
            <EditorLayout />
          </Allotment.Pane>

          {/* 右侧面板 - 可收起 */}
          <Allotment.Pane
            preferredSize={LAYOUT_CONSTANTS.RIGHT_SIDEBAR_DEFAULT_WIDTH}
            priority={LayoutPriority.Low}
            snap
            visible={rightSidebarOpen}
          >
            <RightSidebar rightActivePanel={rightActivePanel} />
          </Allotment.Pane>

          {/* 右侧活动栏 - 固定宽度 */}
          <Allotment.Pane minSize={ACTIVITY_BAR_CONFIG.minSize} maxSize={ACTIVITY_BAR_CONFIG.maxSize}>
            <RightActivityBar
              rightActivePanel={rightActivePanel}
              onToggleRightSidebar={toggleRightSidebar}
              sessionsLength={sessions.length}
            />
          </Allotment.Pane>
        </Allotment>
      </div>

      {/* StatusBar 保持在外层 */}
      <StatusBar />

      {/* SearchCommand 全局弹窗 */}
      <SearchCommand />
    </div>
  );
}
