import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { AI_PROVIDERS, type AIConfig } from "@renderer/stores";
import { toast } from "sonner";

interface AddConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: Omit<AIConfig, "id">) => void;
}

export function AddConfigDialog({ open, onOpenChange, onSave }: AddConfigDialogProps) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<"openai" | "anthropic" | "custom">("openai");
  const [apiKey, setApiKey] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [model, setModel] = useState("gpt-4");

  const selectedProvider = AI_PROVIDERS.find((p) => p.id === provider);

  useEffect(() => {
    if (selectedProvider) {
      if (selectedProvider.id !== "custom") {
        setModel(selectedProvider.defaultModel);
        setBaseURL(selectedProvider.baseURL);
      } else {
        setModel("");
        setBaseURL("");
      }
    }
  }, [selectedProvider]);

  // 重置表单
  const resetForm = () => {
    setName("");
    setProvider("openai");
    setApiKey("");
    setBaseURL("");
    setModel("gpt-4");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name: name || `${selectedProvider?.displayName} 配置`,
      provider,
      apiKey,
      baseURL: baseURL || selectedProvider?.baseURL || "",
      model,
      temperature: 0.7,
      maxTokens: 4000,
      isDefault: false
    });

    toast.success("配置添加成功");
    resetForm();
    onOpenChange(false);
  };

  // 弹窗关闭时重置表单
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>添加 AI 配置</DialogTitle>
          <DialogDescription>配置你的 AI 模型和 API 密钥，本地存储，不会上传到服务器</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">配置名称</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：OpenAI GPT-4" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">服务商</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as "openai" | "anthropic" | "custom")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API 密钥</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              required
            />
            <p className="text-muted-foreground text-xs">你的 API 密钥，本地存储，不会上传到服务器</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseURL">API 地址</Label>
            <Input
              id="baseURL"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://api.example.com/v1"
              required
            />
            <p className="text-muted-foreground text-xs">API 服务的基础地址</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Input
              id="model"
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
            <Button type="submit" disabled={!apiKey.trim()}>
              保存配置
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
