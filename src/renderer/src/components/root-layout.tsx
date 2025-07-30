import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Sidebar } from "@renderer/components/sidebar";

export function RootLayout() {
  return (
    <div className="bg-background flex h-screen">
      {/* 左侧导航栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>

      {/* 开发工具 */}
      <TanStackRouterDevtools />
    </div>
  );
}
