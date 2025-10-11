import { useState } from "react";
import { SettingsSidebar } from "./components/settings-sidebar";
import { AISettingsPanel } from "./components/ai-settings";
import { PromptSettingsPanel } from "./components/prompt-settings";
import { GeneralSettingsPanel } from "./components/general-settings-panel";

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<"ai" | "prompt" | "general">("ai");

  return (
    <div className="flex h-full overflow-hidden">
      {/* 左侧导航 */}
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 右侧内容 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "ai" && <AISettingsPanel />}
        {activeTab === "prompt" && <PromptSettingsPanel />}
        {activeTab === "general" && <GeneralSettingsPanel />}
      </div>
    </div>
  );
}
