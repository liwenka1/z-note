import { Button } from "@renderer/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Search, Home, FileText, Settings, Trash2, Plus } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="bg-sidebar border-sidebar-border flex w-64 flex-col border-r">
      {/* 导航区域 */}
      <div className="flex-1 space-y-1 p-3">
        {/* 搜索按钮 */}
        <Button
          variant="ghost"
          className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start"
          onClick={() => {
            // TODO: 打开搜索弹窗
            console.log("打开搜索");
          }}
        >
          <Search className="mr-3 h-4 w-4" />
          搜索
        </Button>

        {/* 主页 */}
        <Button
          variant="ghost"
          className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start"
          asChild
        >
          <Link to="/">
            <Home className="mr-3 h-4 w-4" />
            主页
          </Link>
        </Button>

        {/* 笔记区域 */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent group w-full justify-between"
            onClick={() => {
              // TODO: 显示创建菜单
              console.log("创建笔记/文件夹");
            }}
          >
            <div className="flex items-center">
              <FileText className="mr-5 h-4 w-4" />
              笔记
            </div>
            <Plus className="h-4 w-4 opacity-60 group-hover:opacity-100" />
          </Button>

          {/* TODO: 这里将来显示笔记文件树 */}
          <div className="ml-6 space-y-1">{/* 占位符 - 将来显示实际的笔记列表 */}</div>
        </div>

        {/* 设置 */}
        <Button
          variant="ghost"
          className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start"
          asChild
        >
          <Link to="/settings">
            <Settings className="mr-3 h-4 w-4" />
            设置
          </Link>
        </Button>

        {/* 垃圾箱 */}
        <Button
          variant="ghost"
          className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start"
          asChild
        >
          <Link to="/trash">
            <Trash2 className="mr-3 h-4 w-4" />
            垃圾箱
          </Link>
        </Button>
      </div>
    </aside>
  );
}
