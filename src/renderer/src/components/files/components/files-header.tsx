import { FileText, Plus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useCreateNote, useCreateFolder } from "@renderer/hooks";
import { useTabStore } from "@renderer/store";
import { generateId } from "@renderer/types";
import { FILES_CLASSES, FILES_CONSTANTS } from "../constants/files";

export function FilesHeader() {
  const navigate = useNavigate();
  const { addTab, setActiveTab } = useTabStore();
  const { mutate: createNote } = useCreateNote();
  const { mutate: createFolder } = useCreateFolder();

  const handleCreateNote = () => {
    const noteId = generateId();
    const noteData = {
      title: "新建笔记",
      content: "",
      folderId: null,
      tagIds: []
    };

    createNote(
      { id: noteId, ...noteData },
      {
        onSuccess: (newNote) => {
          // 添加到标签页并激活
          addTab({ id: newNote.id, title: newNote.title, type: "note" });
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
    const folderData = {
      name: "新建文件夹",
      parentId: null,
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateNote}
            className={FILES_CLASSES.BUTTON_ICON}
            title="新建笔记"
          >
            <FileText className={FILES_CONSTANTS.ICON_SIZE} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateFolder}
            className={FILES_CLASSES.BUTTON_ICON}
            title="新建文件夹"
          >
            <Plus className={FILES_CONSTANTS.ICON_SIZE} />
          </Button>
        </div>
      </div>
    </div>
  );
}
