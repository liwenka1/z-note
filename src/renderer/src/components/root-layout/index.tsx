import { Allotment, LayoutPriority } from "allotment";
import "allotment/dist/style.css";

import { SearchCommand } from "@renderer/components/search-command";
import { StatusBar } from "@renderer/components/status-bar";
import { EditorLayout } from "@renderer/components/root-layout/components/editor-layout";
import { useChatStore } from "@renderer/stores/chat-store";

import { LeftActivityBar } from "./components/left-activity-bar";
import { RightActivityBar } from "./components/right-activity-bar";
import { LeftSidebar } from "./components/left-sidebar";
import { RightSidebar } from "./components/right-sidebar";
import { useLayoutState } from "./hooks/use-layout-state";

export function RootLayout() {
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

  return (
    <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
      {/* 主要布局区域 - 使用 Allotment，预留 StatusBar 空间 */}
      <div className="h-[calc(100vh-24px)]">
        <Allotment proportionalLayout={false}>
          {/* 左侧活动栏 - 固定宽度 */}
          <Allotment.Pane minSize={40} maxSize={40}>
            <LeftActivityBar
              activePanel={activePanel}
              onToggleLeftSidebar={toggleLeftSidebar}
              onSettingsClick={handleSettingsClick}
            />
          </Allotment.Pane>

          {/* 左侧面板 - 可收起 */}
          <Allotment.Pane preferredSize={300} priority={LayoutPriority.Low} snap visible={leftSidebarOpen}>
            <LeftSidebar activePanel={activePanel} />
          </Allotment.Pane>

          {/* 主内容区 - 高优先级 */}
          <Allotment.Pane priority={LayoutPriority.High}>
            <EditorLayout />
          </Allotment.Pane>

          {/* 右侧面板 - 可收起 */}
          <Allotment.Pane preferredSize={350} priority={LayoutPriority.Low} snap visible={rightSidebarOpen}>
            <RightSidebar rightActivePanel={rightActivePanel} />
          </Allotment.Pane>

          {/* 右侧活动栏 - 固定宽度 */}
          <Allotment.Pane minSize={40} maxSize={40}>
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
