import { useState, useEffect } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { AI_PROVIDERS, type AIConfig } from "@renderer/stores/ai-config-store";

interface AddConfigFormProps {
  onSave: (config: Omit<AIConfig, "id">) => void;
  onCancel: () => void;
}

export function AddConfigForm({ onSave, onCancel }: AddConfigFormProps) {
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
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h4 className="mb-4 font-medium">添加 AI 配置</h4>

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

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" disabled={!apiKey.trim()}>
            保存配置
          </Button>
        </div>
      </form>
    </div>
  );
}
