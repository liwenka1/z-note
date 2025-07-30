import { ThemeToggle } from "@renderer/components/theme-toggle";

export function SettingsPage() {
  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold">设置</h1>

        {/* 外观设置 */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">外观</h2>
            <div className="space-y-4">
              <ThemeToggle />
              <div className="text-muted-foreground text-sm">
                选择应用的主题模式。&ldquo;跟随系统&rdquo;会根据你的系统设置自动切换。
              </div>
            </div>
          </div>

          {/* 编辑器设置 - 占位符 */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">编辑器</h2>
            <div className="text-muted-foreground">编辑器设置选项待开发...</div>
          </div>

          {/* 同步设置 - 占位符 */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">同步</h2>
            <div className="text-muted-foreground">同步设置选项待开发...</div>
          </div>

          {/* 关于 */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">关于</h2>
            <div className="text-muted-foreground space-y-2 text-sm">
              <div>Z-Note v0.1.0</div>
              <div>基于 Electron + React + TanStack Router 构建</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
