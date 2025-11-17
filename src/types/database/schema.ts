/**
 * 数据库 Schema 设计
 *
 * 核心理念：
 * 1. 笔记文件存储在本地 JSON 文件中
 * 2. 数据库只存储元数据和关系
 * 3. 文件路径是连接文件系统和数据库的桥梁
 */

/**
 * 页面表 (pages)
 * 存储页面的元数据，实际内容在本地 JSON 文件中
 */
export interface PageTable {
  id: number;
  filePath: string; // 本地文件路径，唯一标识
  title: string; // 从文件元数据同步
  wordCount: number;
  locale: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

/**
 * 标签表 (tags)
 * 纯粹的分类功能
 */
export interface TagTable {
  id: number;
  name: string;
  color?: string;
  icon?: string;
  isPin: number; // 0 or 1
  sortOrder: number;
  createdAt: number;
}

/**
 * 页面-标签关联表 (page_tags)
 * 实现页面多标签
 */
export interface PageTagTable {
  id: number;
  pageId: number;
  tagId: number;
  isPrimary: number; // 0 or 1，标记主标签
  createdAt: number;
}

/**
 * 对话会话表 (chat_sessions)
 * 独立的对话管理
 */
export interface ChatSessionTable {
  id: number;
  title: string;
  model?: string;
  systemPrompt?: string;
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
}

/**
 * 对话消息表 (chat_messages)
 */
export interface ChatMessageTable {
  id: number;
  sessionId: number;
  role: "user" | "assistant" | "system";
  content: string;
  image?: string; // 图片附件
  createdAt: number;
}

/**
 * 会话-页面关联表 (session_pages)
 * 实现知识库功能
 */
export interface SessionPageTable {
  id: number;
  sessionId: number;
  pageId: number;
  contextWeight: number; // 0-1
  createdAt: number;
}

/**
 * 附件表 (attachments)
 * 存储页面的附件信息（扫描、文本、链接等）
 */
export interface AttachmentTable {
  id: number;
  pageId: number;
  type: "scan" | "text" | "link";
  content?: string;
  url?: string;
  description?: string;
  createdAt: number;
  deletedAt?: number;
}

/**
 * 向量文档表 (vector_documents)
 * 用于语义搜索（复用现有设计）
 */
export interface VectorDocumentTable {
  id: number;
  filename: string; // 文件名（对应 filePath）
  chunkId: number; // 文档分块ID
  content: string; // 文本内容
  embedding: string; // 向量数据 JSON
  updatedAt: number;
}
