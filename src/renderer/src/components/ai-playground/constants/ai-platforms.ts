import { Globe } from "lucide-react";

export interface AIPlatform {
  id: string;
  name: string;
  url: string;
  icon?: typeof Globe;
  description?: string;
}

export const AI_PLATFORMS: AIPlatform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chatgpt.com",
    description: "OpenAI 的对话式 AI"
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://chat.deepseek.com",
    description: "DeepSeek 对话助手"
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai",
    description: "Anthropic 的 AI 助手"
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com",
    description: "Google Gemini"
  },
  {
    id: "kimi",
    name: "Kimi",
    url: "https://kimi.moonshot.cn",
    description: "月之暗面 Kimi"
  },
  {
    id: "doubao",
    name: "豆包",
    url: "https://www.doubao.com",
    description: "字节跳动豆包"
  },
  {
    id: "tongyi",
    name: "通义千问",
    url: "https://tongyi.com",
    description: "阿里云通义千问"
  }
];
