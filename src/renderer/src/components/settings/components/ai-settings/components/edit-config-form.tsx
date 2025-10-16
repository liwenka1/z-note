import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { type AIConfig } from "@renderer/stores";

interface EditConfigFormProps {
  config: AIConfig;
  onSave: (updates: Partial<AIConfig>) => void;
  onCancel: () => void;
}

export function EditConfigForm({ config, onSave, onCancel }: EditConfigFormProps) {
  const [name, setName] = useState(config.name);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseURL, setBaseURL] = useState(config.baseURL);
  const [model, setModel] = useState(config.model);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      apiKey,
      baseURL,
      model
    });
  };

  return (
    <Card>
      <CardHeader>
        <h4 className="font-medium">编辑配置</h4>
      </CardHeader>
      <CardContent>
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

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">保存更改</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
