import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { Bot, Settings } from "lucide-react";

export function SettingsPanel() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [activeTab, setActiveTab] = useState<"ai" | "general">("ai");

  const handleSave = () => {
    // TODO: 保存配置到本地存储或数据库
    console.log("保存配置:", { apiKey, model });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* 左侧导航 */}
      <div className="bg-background w-64 border-r p-4">
        <h2 className="mb-4 text-lg font-semibold">设置</h2>

        <div className="space-y-2">
          <Button
            variant={activeTab === "ai" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("ai")}
          >
            <Bot className="mr-2 h-4 w-4" />
            AI 配置
          </Button>

          <Button
            variant={activeTab === "general" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("general")}
          >
            <Settings className="mr-2 h-4 w-4" />
            通用设置
          </Button>
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "ai" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="mb-4 text-xl font-semibold">AI 配置</h3>
              <p className="text-muted-foreground text-sm">配置你的 AI 模型和 API 密钥</p>
            </div>

            <div className="bg-card space-y-4 rounded-lg border p-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API 密钥</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">你的 OpenAI API 密钥，本地存储，不会上传到服务器</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">默认模型</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave}>保存配置</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "general" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="mb-4 text-xl font-semibold">通用设置</h3>
              <p className="text-muted-foreground text-sm">应用的基本设置</p>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground">通用设置选项待开发...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
