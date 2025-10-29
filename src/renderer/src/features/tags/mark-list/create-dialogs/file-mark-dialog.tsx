import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";
import { useCreateMark } from "@renderer/hooks/mutations";

interface FileMarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: number;
}

export function FileMarkDialog({ open, onOpenChange, tagId }: FileMarkDialogProps) {
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const createMark = useCreateMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMark.mutateAsync({
        tagId,
        type: "file",
        desc: desc.trim() || undefined,
        url: url.trim() || undefined,
        content: content.trim() || undefined
      });

      // 成功后关闭对话框并重置表单
      onOpenChange(false);
      setDesc("");
      setUrl("");
      setContent("");
    } catch (error) {
      console.error("创建文件记录失败:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    // 关闭时重置表单
    if (!newOpen) {
      setDesc("");
      setUrl("");
      setContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加文件记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-desc">描述</Label>
            <Input
              id="file-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="记录描述"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-url">文件路径</Label>
            <Input id="file-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="文件路径或 URL" />
            <p className="text-muted-foreground text-xs">可以是本地文件路径或网络地址</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-content">备注</Label>
            <Textarea
              id="file-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="文件相关的备注信息（可选）"
              rows={4}
            />
          </div>
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
