import { Outlet } from "@tanstack/react-router";
import { SearchCommand } from "@renderer/components/search-command";
import { useNotesStore } from "@renderer/store";
import { useEffect } from "react";

export function SimpleRootLayout() {
  const { initializeData } = useNotesStore();

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <div className="bg-background h-screen w-screen overflow-hidden">
      {/* 主内容区域 */}
      <Outlet />

      {/* 搜索弹窗 */}
      <SearchCommand />
    </div>
  );
}
