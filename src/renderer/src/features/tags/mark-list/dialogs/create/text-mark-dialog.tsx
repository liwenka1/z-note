import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { useCreateMark } from "@renderer/hooks/mutations";
import { DescField, ContentField } from "../../components/mark-form-fields";

interface TextMarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: number;
}

export function TextMarkDialog({ open, onOpenChange, tagId }: TextMarkDialogProps) {
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const createMark = useCreateMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMark.mutateAsync({
        tagId,
        type: "text",
        desc: desc.trim() || undefined,
        content: content.trim() || undefined
      });

      // 成功后关闭对话框并重置表单
      onOpenChange(false);
      setDesc("");
      setContent("");
    } catch (error) {
      console.error("创建文本记录失败:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    // 关闭时重置表单
    if (!newOpen) {
      setDesc("");
      setContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加文本记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DescField value={desc} onChange={setDesc} autoFocus />
          <ContentField value={content} onChange={setContent} rows={6} />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={createMark.isPending}>
              {createMark.isPending ? "创建中..." : "创建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
