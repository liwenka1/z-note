import { FileText, FolderPlus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useFilesState } from "./hooks/use-files-state";
import { useNoteManager } from "@renderer/hooks";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent
} from "@renderer/components/ui/empty";

const suggestions = [
  {
    icon: FileText,
    text: "创建第一个笔记",
    description: "开始记录你的想法"
  },
  {
    icon: FolderPlus,
    text: "创建文件夹",
    description: "组织你的笔记结构"
  }
];

export function EmptyFiles() {
  const { createFolder, workspacePath } = useFilesState();
  const { quickCreateNote } = useNoteManager();

  const handleCreateNote = async () => {
    await quickCreateNote();
  };

  const handleCreateFolder = async () => {
    try {
      const folderName = `新文件夹_${Date.now()}`;
      await createFolder(workspacePath, folderName);
      console.log("文件夹创建成功:", folderName);
    } catch (error) {
      console.error("创建文件夹失败:", error);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (suggestionText.includes("笔记")) {
      handleCreateNote();
    } else if (suggestionText.includes("文件夹")) {
      handleCreateFolder();
    }
  };

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>暂无文件</EmptyTitle>
        <EmptyDescription>创建你的第一个笔记或文件夹开始整理思路</EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex w-full flex-col gap-2">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto w-full justify-start p-4 text-left whitespace-normal"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                <Icon className="mr-3 h-5 w-5 shrink-0 text-blue-500" />
                <div className="flex flex-col items-start gap-0.5">
                  <div className="text-sm font-medium">{suggestion.text}</div>
                  <div className="text-muted-foreground text-xs font-normal">{suggestion.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </EmptyContent>
    </Empty>
  );
}
