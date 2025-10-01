import type { Mark } from "@renderer/types";

/**
 * 按类型分类 marks
 */
export function categorizeMarks(marks: Mark[]) {
  return {
    scan: marks.filter((item) => item.type === "scan"),
    text: marks.filter((item) => item.type === "text"),
    image: marks.filter((item) => item.type === "image"),
    link: marks.filter((item) => item.type === "link"),
    file: marks.filter((item) => item.type === "file")
  };
}

/**
 * 构建单个类型的内容
 */
export function buildTypeContent(marks: Mark[], type: Mark["type"]) {
  if (marks.length === 0) return "";

  return marks
    .map((item, index) => {
      let content = "";
      switch (type) {
        case "scan":
        case "text":
        case "file":
          content = item.content || "";
          break;
        case "image":
          content = item.desc || item.content || "";
          break;
        case "link":
          content = item.desc || item.url || "";
          break;
      }
      return `${index + 1}. ${content}`;
    })
    .join(";\n\n");
}

/**
 * 构建标签上下文内容
 */
export function buildTagContext(marks: Mark[]) {
  if (!marks || marks.length === 0) return "";

  const categorized = categorizeMarks(marks);

  const scanContent = buildTypeContent(categorized.scan, "scan");
  const textContent = buildTypeContent(categorized.text, "text");
  const imageContent = buildTypeContent(categorized.image, "image");
  const linkContent = buildTypeContent(categorized.link, "link");
  const fileContent = buildTypeContent(categorized.file, "file");

  // 只包含有内容的部分
  const sections: string[] = [];

  if (scanContent) {
    sections.push(`以下是通过截图后，使用OCR识别出的文字片段：\n${scanContent}。`);
  }

  if (textContent) {
    sections.push(`以下是通过文本复制记录的片段：\n${textContent}。`);
  }

  if (imageContent) {
    sections.push(`以下是图片记录：\n${imageContent}。`);
  }

  if (linkContent) {
    sections.push(`以下是链接记录：\n${linkContent}。`);
  }

  if (fileContent) {
    sections.push(`以下是文件记录：\n${fileContent}。`);
  }

  if (sections.length === 0) return "";

  return `可以参考以下内容笔记的记录：\n${sections.join("\n\n")}\n\n`;
}

/**
 * 构建AI请求内容（包含标签上下文）
 */
export function buildAIRequestContent(userInput: string, marks?: Mark[]) {
  if (!marks || marks.length === 0) {
    return userInput;
  }

  const tagContext = buildTagContext(marks);
  return `${tagContext}${userInput}`;
}
