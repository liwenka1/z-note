import { Outlet, useNavigate } from "@tanstack/react-router";
import { TabBar } from "./tab-bar";
import { useTabStore } from "@renderer/store/tab-store";
import { SettingsPage } from "@renderer/pages/settings-page";
import { useEffect } from "react";

export function EditorLayout() {
  const { openTabs, activeTabId } = useTabStore();
  const navigate = useNavigate();

  // 获取当前激活的 tab
  const activeTab = openTabs.find((tab) => tab.id === activeTabId);

  // 当没有任何 tab 时，导航到首页
  useEffect(() => {
    if (openTabs.length === 0) {
      navigate({ to: "/" });
    }
  }, [openTabs.length, navigate]);

  const renderContent = () => {
    // 如果有激活的 tab 且是设置页面，直接渲染设置页面
    if (activeTab?.type === "settings") {
      return <SettingsPage />;
    }

    // 其他情况（包括笔记 tab 或没有 tab）都显示路由内容
    return <Outlet />;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 标签栏 - 只有打开标签时才显示 */}
      {openTabs.length > 0 && <TabBar />}

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
}
