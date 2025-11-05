import { FileText } from "lucide-react";
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
    text: "创建笔记"
  },
  {
    text: "创建文件夹"
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
        <div className="flex gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex-1"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              {suggestion.text}
            </Button>
          ))}
        </div>
      </EmptyContent>
    </Empty>
  );
}
