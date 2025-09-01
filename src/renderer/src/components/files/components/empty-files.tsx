import { motion } from "framer-motion";
import { FileText, FolderPlus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useCreateNote, useCreateFolder } from "@renderer/hooks";
import { useNavigate } from "@tanstack/react-router";

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
  const { mutate: createNote } = useCreateNote();
  const { mutate: createFolder } = useCreateFolder();
  const navigate = useNavigate();

  const handleCreateNote = () => {
    createNote(
      {
        title: `新笔记 ${Date.now()}`,
        content: "",
        folderId: undefined,
        tagIds: []
      },
      {
        onSuccess: (newNote) => {
          navigate({ to: "/notes/$noteId", params: { noteId: newNote.id } });
        }
      }
    );
  };

  const handleCreateFolder = () => {
    createFolder({
      name: `新文件夹 ${Date.now()}`,
      parentId: undefined,
      color: "#6b7280",
      icon: "📁"
    });
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (suggestionText.includes("笔记")) {
      handleCreateNote();
    } else if (suggestionText.includes("文件夹")) {
      handleCreateFolder();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-center p-6 text-center"
    >
      {/* 图标 */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-secondary/50 mb-4 rounded-full p-4"
      >
        <FileText className="text-muted-foreground h-8 w-8" />
      </motion.div>

      {/* 标题和描述 */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-foreground mb-2 text-lg font-medium"
      >
        暂无文件
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-6 text-sm"
      >
        创建你的第一个笔记或文件夹开始整理思路
      </motion.p>

      {/* 建议操作 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="text-foreground hover:bg-secondary/80 w-full justify-start p-3 text-left"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <Icon className="mr-3 h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{suggestion.text}</div>
                <div className="text-muted-foreground text-xs">{suggestion.description}</div>
              </div>
            </Button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
