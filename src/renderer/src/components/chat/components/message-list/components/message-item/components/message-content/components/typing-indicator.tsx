import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">AI 正在思考</span>
      <motion.div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="bg-muted-foreground h-1 w-1 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
