import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { useNotesStore } from "@renderer/store";
import type { Note } from "@renderer/types";

interface RestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Note | null;
}

export function RestoreDialog({ open, onOpenChange, item }: RestoreDialogProps) {
  const { folders, restoreNote, moveNoteToFolder } = useNotesStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string>("root");

  if (!item) return null;

  // 获取活跃的文件夹
  const activeFolders = folders.filter((f) => !f.isDeleted);

  // 检查原始文件夹是否存在
  const originalFolder = item.folderId ? folders.find((f) => f.id === item.folderId) : null;
  const originalFolderExists = originalFolder && !originalFolder.isDeleted;

  const handleRestore = () => {
    if (originalFolderExists) {
      // 原始位置存在，直接恢复
      restoreNote(item.id);
    } else {
      // 原始位置不存在，根据用户选择恢复
      restoreNote(item.id);
      if (selectedFolderId && selectedFolderId !== "root") {
        moveNoteToFolder(item.id, selectedFolderId);
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>恢复笔记</DialogTitle>
          <DialogDescription>选择恢复笔记的位置，或将其恢复到原始位置。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">
              笔记: <span className="font-medium">{item.title}</span>
            </p>
          </div>

          {originalFolderExists ? (
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm">
                将恢复到原始位置: <span className="font-medium">{originalFolder?.name}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">原始文件夹已被删除，请选择新的位置：</p>
              </div>

              <div>
                <label className="text-sm font-medium">选择文件夹</label>
                <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择文件夹或恢复到根目录" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">根目录</SelectItem>
                    {activeFolders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleRestore}>恢复</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
