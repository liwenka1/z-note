import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Sidebar } from "@renderer/components/sidebar";
import { SearchCommand } from "@renderer/components/search-command";

export function RootLayout() {
  return (
    <div className="bg-background flex h-screen">
      {/* 左侧导航栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>

      {/* 搜索弹窗 */}
      <SearchCommand />

      {/* 开发工具 */}
      <TanStackRouterDevtools />
    </div>
  );
}
