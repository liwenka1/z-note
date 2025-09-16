// ==================== Tiptap JSON 内容提取工具 ====================

import type { JSONContent } from "@tiptap/react";
import type { NoteFileContent } from "@renderer/types/file-content";

/**
 * 从 Tiptap JSON 结构中递归提取纯文本内容
 * 效仿 z-note Tauri 项目的内容提取策略
 */
export function extractTextFromTiptapJSON(content: JSONContent): string {
  if (!content) {
    return "";
  }

  let text = "";

  // 如果节点有文本内容，直接添加
  if (content.text) {
    text += content.text;
  }

  // 递归处理子节点
  if (content.content && Array.isArray(content.content)) {
    for (const child of content.content) {
      const childText = extractTextFromTiptapJSON(child);
      text += childText;

      // 为块级元素添加换行符，模拟段落分隔
      if (isBlockElement(child.type)) {
        text += "\n";
      }
    }
  }

  return text;
}

/**
 * 从完整的笔记文件中提取可搜索的内容
 */
export function extractSearchableContent(noteFile: NoteFileContent): {
  title: string;
  content: string;
  fullText: string;
  metadata: NoteFileContent["metadata"];
  path?: string;
} {
  const title = noteFile.metadata.title;
  const content = extractTextFromTiptapJSON(noteFile.content);

  return {
    title,
    content,
    fullText: `${title}\n${content}`, // 标题 + 内容的完整文本
    metadata: noteFile.metadata
  };
}

/**
 * 判断是否为块级元素（需要添加换行符）
 */
function isBlockElement(nodeType?: string): boolean {
  const blockElements = [
    "paragraph",
    "heading",
    "blockquote",
    "codeBlock",
    "listItem",
    "bulletList",
    "orderedList",
    "horizontalRule",
    "doc"
  ];

  return blockElements.includes(nodeType || "");
}

/**
 * 提取文档结构信息（用于高级搜索）
 */
export function extractDocumentStructure(content: JSONContent): {
  headings: Array<{ level: number; text: string }>;
  links: Array<{ href: string; text: string }>;
  codeBlocks: Array<{ language?: string; code: string }>;
} {
  const headings: Array<{ level: number; text: string }> = [];
  const links: Array<{ href: string; text: string }> = [];
  const codeBlocks: Array<{ language?: string; code: string }> = [];

  function traverse(node: JSONContent) {
    // 提取标题
    if (node.type === "heading" && node.attrs?.level) {
      const text = extractTextFromTiptapJSON(node);
      headings.push({
        level: node.attrs.level,
        text: text.trim()
      });
    }

    // 提取链接
    if (node.type === "link" && node.attrs?.href) {
      const text = extractTextFromTiptapJSON(node);
      links.push({
        href: node.attrs.href,
        text: text.trim()
      });
    }

    // 提取代码块
    if (node.type === "codeBlock") {
      const code = extractTextFromTiptapJSON(node);
      codeBlocks.push({
        language: node.attrs?.language,
        code: code.trim()
      });
    }

    // 递归处理子节点
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        traverse(child);
      }
    }
  }

  if (content) {
    traverse(content);
  }

  return { headings, links, codeBlocks };
}

/**
 * 计算文档统计信息
 */
export function calculateDocumentStats(content: JSONContent): {
  characterCount: number;
  wordCount: number;
  paragraphCount: number;
} {
  const text = extractTextFromTiptapJSON(content);

  return {
    characterCount: text.length,
    wordCount: text.split(/\s+/).filter((word) => word.length > 0).length,
    paragraphCount: (text.match(/\n/g) || []).length + 1
  };
}
