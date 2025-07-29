import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@renderer/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { Search, Home, Settings, Trash2, Plus, ChevronLeft } from "lucide-react";

export function Sidebar() {
  // 临时状态来模拟是否有笔记
  const [hasNotes, setHasNotes] = useState(false);

  return (
    <aside className="bg-sidebar border-sidebar-border flex w-64 flex-col border-r">
      {/* 固定顶部区域 */}
      <div>
        {/* 用户信息区域 */}
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-between p-2"
            onClick={() => {
              // TODO: 修改用户信息功能
              console.log("修改用户信息");
            }}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="用户头像" />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">用</AvatarFallback>
              </Avatar>
              <span className="text-sidebar-foreground text-sm font-medium">用户名</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                // TODO: 收起侧边栏功能
                console.log("收起侧边栏");
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Button>
        </div>

        {/* 核心功能区域 */}
        <div className="border-sidebar-border space-y-1 border-t px-3 py-3">
          {/* 搜索 */}
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
            className="text-sidebar-foreground hover:bg-sidebar-accent [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground w-full justify-start"
            asChild
          >
            <Link
              to="/"
              activeProps={{
                className: "active"
              }}
            >
              <Home className="mr-3 h-4 w-4" />
              主页
            </Link>
          </Button>
        </div>
      </div>

      {/* 可滚动内容区域 */}
      <div className="scrollbar-thin border-sidebar-border flex-1 overflow-y-auto border-t">
        {/* 笔记区域 */}
        <div className="px-3 py-3">
          {!hasNotes ? (
            // 无笔记状态
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-between px-2 py-1"
                onClick={() => {
                  // TODO: 笔记区域操作（可能是折叠/展开或其他）
                  console.log("笔记区域点击");
                }}
              >
                <span className="text-sm">笔记</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sidebar-foreground hover:bg-sidebar-accent h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    setHasNotes(true); // 临时模拟创建笔记
                    console.log("新建笔记/文件夹");
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </Button>
              <Button
                variant="ghost"
                className="text-sidebar-foreground hover:bg-sidebar-accent [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground w-full justify-start"
                onClick={() => {
                  setHasNotes(true); // 临时模拟创建笔记
                  console.log("新建笔记");
                }}
              >
                <Plus className="mr-3 h-4 w-4" />
                新建笔记
              </Button>
            </div>
          ) : (
            // 有笔记状态
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-between px-2 py-1"
                onClick={() => {
                  // TODO: 笔记区域操作（可能是折叠/展开或其他）
                  console.log("笔记区域点击");
                }}
              >
                <span className="text-sm">笔记</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sidebar-foreground hover:bg-sidebar-accent h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    // TODO: 显示创建菜单
                    console.log("创建笔记/文件夹");
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </Button>
              {/* 笔记列表 */}
              <div className="ml-2 space-y-1">
                {/* 临时显示一些示例笔记 */}
                <Button
                  variant="ghost"
                  className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start text-sm"
                  onClick={() => console.log("打开笔记")}
                >
                  📄 我的第一篇笔记
                </Button>
                <Button
                  variant="ghost"
                  className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start text-sm"
                  onClick={() => console.log("打开文件夹")}
                >
                  📁 工作文件夹
                </Button>
                <div className="ml-4 space-y-1">
                  <Button
                    variant="ghost"
                    className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start text-sm"
                    onClick={() => console.log("打开笔记")}
                  >
                    📄 会议记录
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start text-sm"
                    onClick={() => console.log("打开笔记")}
                  >
                    📄 项目计划
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 系统功能区域 */}
        <div className="border-sidebar-border space-y-1 border-t px-3 py-2">
          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground w-full justify-start"
            asChild
          >
            <Link
              to="/settings"
              activeProps={{
                className: "active"
              }}
            >
              <Settings className="mr-3 h-4 w-4" />
              设置
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="text-sidebar-foreground hover:bg-sidebar-accent [&.active]:bg-sidebar-accent [&.active]:text-sidebar-accent-foreground w-full justify-start"
            asChild
          >
            <Link
              to="/trash"
              activeProps={{
                className: "active"
              }}
            >
              <Trash2 className="mr-3 h-4 w-4" />
              垃圾箱
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
