/**
 * 记录按钮组件
 * 将AI回复记录到关联的标签中
 */
import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { BookmarkPlus, Check } from "lucide-react";
import { useCreateMark } from "@renderer/hooks/mutations";
import { chatsApi } from "@renderer/api";
import { toast } from "sonner";
import type { Message } from "@renderer/stores";

interface RecordButtonProps {
  message: Message;
  associatedTagId: number | null;
}

export function RecordButton({ message, associatedTagId }: RecordButtonProps) {
  const [isRecorded, setIsRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const createMark = useCreateMark();

  // 只有AI回复才显示记录按钮
  if (message.role !== "assistant") {
    return null;
  }

  // 如果没有关联标签，显示禁用状态的按钮
  const isDisabled = !associatedTagId || isRecording || isRecorded;

  const handleRecord = async () => {
    if (!associatedTagId) {
      return;
    }
    setIsRecording(true);
    try {
      // 1. 创建Mark记录
      await createMark.mutateAsync({
        tagId: associatedTagId,
        type: "text",
        content: message.content,
        desc: generateDescription(message.content)
      });

      // 2. 标记Chat记录为已记录
      const chatId = parseInt(message.id.replace("msg_", ""));
      await chatsApi.updateInserted(chatId, true);

      setIsRecorded(true);
      toast.success("已记录到标签中");
    } catch (error) {
      console.error("记录失败:", error);
      toast.error("记录失败");
    } finally {
      setIsRecording(false);
    }
  };

  // 生成记录描述（取前50个字符）
  const generateDescription = (content: string): string => {
    const cleaned = content.trim();
    if (cleaned.length <= 50) return cleaned;
    return cleaned.slice(0, 50) + "...";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={handleRecord}
      disabled={isDisabled}
      title={!associatedTagId ? "请先为会话关联标签" : isRecorded ? "已记录" : "记录到标签"}
    >
      {isRecorded ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <BookmarkPlus className={`h-3 w-3 ${isRecording ? "opacity-50" : ""}`} />
      )}
    </Button>
  );
}
