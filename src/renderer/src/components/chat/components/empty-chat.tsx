import { motion } from "framer-motion";
import { Bot, Sparkles, Code, FileText } from "lucide-react";
import { useChatStore } from "@renderer/stores/chat-store";

const suggestions = [
  {
    icon: FileText,
    text: "帮我分析这个笔记",
    description: "分析当前笔记的内容和结构"
  },
  {
    icon: Code,
    text: "生成一个代码示例",
    description: "根据需求生成相关代码"
  },
  {
    icon: Sparkles,
    text: "总结文档要点",
    description: "提取文档的核心信息"
  }
];

export function EmptyChat() {
  const { addMessage, getCurrentSession, createSession } = useChatStore();

  const handleSuggestionClick = (suggestionText: string) => {
    let sessionId = getCurrentSession()?.id;

    // 如果没有当前会话，创建一个新会话
    if (!sessionId) {
      sessionId = createSession();
    }

    addMessage(sessionId, {
      role: "user",
      content: suggestionText
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center p-8 text-center"
    >
      {/* AI 图标 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="bg-secondary/50 mb-6 rounded-full p-6"
      >
        <Bot className="text-muted-foreground h-12 w-12" />
      </motion.div>

      {/* 标题和描述 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="mb-2 text-lg font-semibold">开始与 AI 助手 对话</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          我可以帮助您解答问题、编写代码、分析文档内容等。 让我们开始一段智能对话吧！
        </p>
      </motion.div>

      {/* 建议按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid w-full max-w-sm gap-3"
      >
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-border flex items-center gap-3 rounded-lg border p-4 text-left transition-all"
            onClick={() => handleSuggestionClick(suggestion.text)}
          >
            <div className="bg-primary/10 rounded-md p-2">
              <suggestion.icon className="text-primary h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{suggestion.text}</div>
              <div className="text-muted-foreground text-xs">{suggestion.description}</div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-muted-foreground mt-8 text-xs"
      >
        您也可以直接在下方输入框中输入问题
      </motion.div>
    </motion.div>
  );
}
