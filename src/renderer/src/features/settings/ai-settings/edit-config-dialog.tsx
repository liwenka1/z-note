import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { type AIConfig } from "@renderer/stores";
import { toast } from "sonner";

interface EditConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AIConfig | null;
  onSave: (updates: Partial<AIConfig>) => void;
}

export function EditConfigDialog({ open, onOpenChange, config, onSave }: EditConfigDialogProps) {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [model, setModel] = useState("");

  // 当 config 变化时，更新表单
  useEffect(() => {
    if (config) {
      setName(config.name);
      setApiKey(config.apiKey);
      setBaseURL(config.baseURL);
      setModel(config.model);
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      apiKey,
      baseURL,
      model
    });

    toast.success("配置更新成功");
    onOpenChange(false);
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>编辑 AI 配置</DialogTitle>
          <DialogDescription>修改你的 AI 模型配置信息</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">配置名称</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-apiKey">API 密钥</Label>
            <Input
              id="edit-apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-baseURL">API 地址</Label>
            <Input
              id="edit-baseURL"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.example.com/v1"
              required
            />
            <p className="text-muted-foreground text-xs">API 服务的基础地址</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-model">模型</Label>
            <Input
              id="edit-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4, claude-3-sonnet, 等"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">保存更改</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
