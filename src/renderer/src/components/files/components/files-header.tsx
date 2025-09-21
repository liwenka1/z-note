import { FileText, Folder, RefreshCw } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useFilesState } from "../hooks/use-files-state";
import { useNoteManager } from "@renderer/hooks/use-note-manager";

export function FilesHeader() {
  const { createFolder, refreshFileTree, workspacePath } = useFilesState();
  const { quickCreateNote } = useNoteManager();

  const handleCreateNote = async () => {
    await quickCreateNote();
  };

  const handleCreateFolder = async () => {
    try {
      const folderName = `新建文件夹_${Date.now()}`;
      await createFolder(workspacePath, folderName);
      console.log("文件夹创建成功:", folderName);
    } catch (error) {
      console.error("创建文件夹失败:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshFileTree();
      console.log("文件树刷新成功");
    } catch (error) {
      console.error("刷新文件树失败:", error);
    }
  };

  return (
    <div className="border-border/50 bg-secondary/30 border-b">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-foreground text-sm font-medium">笔记</h2>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleCreateNote} className="h-7 w-7 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>新建笔记</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleCreateFolder} className="h-7 w-7 p-0">
                <Folder className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>新建文件夹</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-7 w-7 p-0">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>刷新</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
