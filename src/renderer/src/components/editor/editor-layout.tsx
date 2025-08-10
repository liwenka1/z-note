import { Outlet } from "@tanstack/react-router";
import { TabBar } from "./tab-bar";
import { useTabStore } from "@renderer/store/tab-store";

export function EditorLayout() {
  const { openTabs } = useTabStore();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 标签栏 - 只有打开标签时才显示 */}
      {openTabs.length > 0 && <TabBar />}

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
