export function IndexPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-semibold">主页</h1>

          {/* 原有的欢迎内容 */}
          <div className="bg-card mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-medium">欢迎使用 Z-Note</h2>
            <p className="text-muted-foreground mb-4">这是一个基于 Electron 和 React 的笔记应用</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="mb-2 font-medium">快速开始</h3>
                <p className="text-muted-foreground text-sm">
                  点击左侧的&ldquo;笔记&rdquo;旁边的 + 按钮开始创建你的第一篇笔记
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="mb-2 font-medium">搜索功能</h3>
                <p className="text-muted-foreground text-sm">使用搜索功能快速找到你需要的笔记内容</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
