export type SettingsSection = "general" | "appearance" | "editor" | "ai" | "sync" | "about";

export interface SettingsItem {
  id: SettingsSection;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AISettings {
  apiKey: string;
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3";
  temperature: number;
  maxTokens: number;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  fontSize: number;
  fontFamily: string;
}

export interface EditorSettings {
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  autoSave: boolean;
}
