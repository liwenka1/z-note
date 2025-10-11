import { Button } from "@renderer/components/ui/button";
import { Bot, Settings, MessageSquare } from "lucide-react";

interface SettingsSidebarProps {
  activeTab: "ai" | "prompt" | "general";
  onTabChange: (tab: "ai" | "prompt" | "general") => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="bg-background w-64 border-r p-4">
      <h2 className="mb-4 text-lg font-semibold">设置</h2>

      <div className="space-y-2">
        <Button
          variant={activeTab === "ai" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onTabChange("ai")}
        >
          <Bot className="mr-2 h-4 w-4" />
          AI 配置
        </Button>

        <Button
          variant={activeTab === "prompt" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onTabChange("prompt")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Prompt 配置
        </Button>

        <Button
          variant={activeTab === "general" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onTabChange("general")}
        >
          <Settings className="mr-2 h-4 w-4" />
          通用设置
        </Button>
      </div>
    </div>
  );
}
