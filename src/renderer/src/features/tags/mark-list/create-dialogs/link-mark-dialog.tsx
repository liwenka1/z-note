import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Textarea } from "@renderer/components/ui/textarea";
import { useCreateMark } from "@renderer/hooks/mutations";

interface LinkMarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagId: number;
}

export function LinkMarkDialog({ open, onOpenChange, tagId }: LinkMarkDialogProps) {
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const createMark = useCreateMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMark.mutateAsync({
        tagId,
        type: "link",
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
      console.error("创建链接记录失败:", error);
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
          <DialogTitle>添加链接记录</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-desc">描述</Label>
            <Input
              id="link-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="记录描述"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url">链接地址</Label>
            <Input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-content">备注</Label>
            <Textarea
              id="link-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="链接相关的备注信息（可选）"
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
