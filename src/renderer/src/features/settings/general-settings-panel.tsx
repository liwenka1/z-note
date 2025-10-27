import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useFilesStore } from "@renderer/stores/files-store";
import { workspaceApi } from "@renderer/api/file-system";
import { Folder, RotateCcw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function GeneralSettingsPanel() {
  const { workspace, switchWorkspace } = useFilesStore();
  const [currentPath, setCurrentPath] = useState("");
  const [defaultPath, setDefaultPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 加载当前工作区路径和默认路径
    setCurrentPath(workspace.config.workspacePath);
    workspaceApi.getDefaultPath().then(setDefaultPath);
  }, [workspace.config.workspacePath]);

  const handleSelectWorkspace = async () => {
    try {
      setIsLoading(true);
      const selectedPath = await workspaceApi.selectDirectory();
      if (selectedPath) {
        await switchWorkspace(selectedPath);
        toast.success("工作区切换成功", {
          description: `已切换到：${selectedPath}`
        });
      }
    } catch (error) {
      console.error("切换工作区失败:", error);
      toast.error("切换工作区失败", {
        description: error instanceof Error ? error.message : "未知错误"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    try {
      setIsLoading(true);
      await switchWorkspace(defaultPath);
      toast.success("已重置到默认工作区");
    } catch (error) {
      console.error("重置工作区失败:", error);
      toast.error("重置工作区失败", {
        description: error instanceof Error ? error.message : "未知错误"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDefaultWorkspace = currentPath === defaultPath;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-xl font-semibold">通用设置</h3>
        <p className="text-muted-foreground text-sm">应用的基本设置</p>
      </div>

      {/* 工作区设置 */}
      <div className="bg-card space-y-4 rounded-lg border p-6">
        <div>
          <h4 className="text-lg font-medium">笔记工作区</h4>
          <p className="text-muted-foreground text-sm">配置笔记存储位置</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workspace-path">当前工作区路径</Label>
          <div className="flex gap-2">
            <Input id="workspace-path" value={currentPath} readOnly className="flex-1 font-mono text-sm" />
            <Button onClick={handleSelectWorkspace} disabled={isLoading} variant="outline">
              <Folder className="mr-2 h-4 w-4" />
              选择文件夹
            </Button>
          </div>

          {isDefaultWorkspace && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>当前使用默认工作区</span>
            </div>
          )}
        </div>

        {!isDefaultWorkspace && (
          <div>
            <Button onClick={handleResetToDefault} disabled={isLoading} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              重置到默认工作区
            </Button>
          </div>
        )}

        <div className="text-muted-foreground border-t pt-4 text-sm">
          <p>默认工作区：{defaultPath}</p>
        </div>
      </div>
    </div>
  );
}
