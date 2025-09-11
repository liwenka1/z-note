import { FileText, Plus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useCreateNote, useCreateFolder } from "@renderer/hooks";
import { useTabStore } from "@renderer/stores";
import { FolderFormData, NoteFormData } from "@renderer/types";

export function FilesHeader() {
  const navigate = useNavigate();
  const { openTab, setActiveTab } = useTabStore();
  const { mutate: createNote } = useCreateNote();
  const { mutate: createFolder } = useCreateFolder();

  const handleCreateNote = () => {
    const noteData: NoteFormData = {
      title: "新建笔记",
      content: "",
      folderId: undefined,
      tagIds: []
    };

    createNote(
      { ...noteData },
      {
        onSuccess: (newNote) => {
          // 添加到标签页并激活
          openTab(newNote.id, newNote.title, "note");
          setActiveTab(newNote.id);
          // 导航到新笔记
          navigate({ to: "/notes/$noteId", params: { noteId: newNote.id } });
        },
        onError: (error) => {
          console.error("创建笔记失败:", error);
        }
      }
    );
  };

  const handleCreateFolder = () => {
    const folderData: FolderFormData = {
      name: "新建文件夹",
      parentId: undefined,
      color: "#3b82f6",
      icon: "📁"
    };

    createFolder(folderData, {
      onSuccess: (newFolder) => {
        console.log("文件夹创建成功:", newFolder);
      },
      onError: (error) => {
        console.error("创建文件夹失败:", error);
      }
    });
  };

  return (
    <div className="border-border/50 bg-secondary/30 border-b">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-foreground text-sm font-medium">笔记</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleCreateNote} className="h-7 w-7 p-0" title="新建笔记">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCreateFolder} className="h-7 w-7 p-0" title="新建文件夹">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
