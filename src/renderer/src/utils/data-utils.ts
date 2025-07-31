import type { Note, Folder, Tag } from "@renderer/types";

// ==================== 数据生成工具函数 ====================

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 生成摘要（提取前150个字符）
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/[#*`_~\[\]()]/g, "") // 移除 Markdown 标记
    .replace(/\n+/g, " ") // 换行转空格
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + "...";
}

// 计算字数
export function calculateWordCount(content: string): number {
  // 移除 Markdown 语法后计算字数
  const plainText = content
    .replace(/[#*`_~\[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  // 中英文混合计数
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;

  return chineseChars + englishWords;
}

// 计算阅读时间（分钟）
export function calculateReadingTime(wordCount: number): number {
  // 中文阅读速度约 400-500 字/分钟，英文约 200-250 词/分钟
  // 这里取一个平均值
  const wordsPerMinute = 400;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 生成随机颜色
export function generateRandomColor(): string {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#6b7280", // gray
    "#84cc16" // lime
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 创建笔记时的数据处理
export function createNoteData(input: { title: string; content: string; folderId?: string; tags?: string[] }): Note {
  const now = new Date();
  const wordCount = calculateWordCount(input.content);

  return {
    id: generateId(),
    title: input.title,
    content: input.content,
    excerpt: generateExcerpt(input.content),
    folderId: input.folderId,
    tags: input.tags || [],
    isFavorite: false,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    wordCount,
    readingTime: calculateReadingTime(wordCount)
  };
}

// 更新笔记时的数据处理
export function updateNoteData(note: Note, updates: Partial<Note>): Note {
  const updatedNote = { ...note, ...updates };

  // 如果内容发生变化，重新计算相关字段
  if (updates.content !== undefined) {
    updatedNote.wordCount = calculateWordCount(updates.content);
    updatedNote.readingTime = calculateReadingTime(updatedNote.wordCount);
    updatedNote.excerpt = generateExcerpt(updates.content);
  }

  updatedNote.updatedAt = new Date();
  return updatedNote;
}

// 创建文件夹时的数据处理
export function createFolderData(input: {
  name: string;
  parentId?: string;
  color?: string;
  icon?: string;
  description?: string;
}): Folder {
  const now = new Date();

  return {
    id: generateId(),
    name: input.name,
    parentId: input.parentId,
    color: input.color || generateRandomColor(),
    icon: input.icon || "📁",
    description: input.description,
    isDeleted: false,
    isExpanded: false,
    sortOrder: Date.now(), // 使用时间戳作为默认排序
    createdAt: now,
    updatedAt: now
  };
}

// 创建标签时的数据处理
export function createTagData(input: { name: string; color?: string; description?: string }): Tag {
  const now = new Date();

  return {
    id: generateId(),
    name: input.name,
    color: input.color || generateRandomColor(),
    description: input.description,
    usageCount: 0,
    createdAt: now,
    updatedAt: now
  };
}

// ==================== 数据查询和筛选工具 ====================

// 根据文件夹ID筛选笔记
export function filterNotesByFolder(notes: Note[], folderId?: string): Note[] {
  if (!folderId) return notes;
  return notes.filter((note) => note.folderId === folderId);
}

// 根据标签筛选笔记
export function filterNotesByTags(notes: Note[], tagIds: string[]): Note[] {
  if (tagIds.length === 0) return notes;
  return notes.filter((note) => tagIds.some((tagId) => note.tags.includes(tagId)));
}

// 根据收藏状态筛选笔记
export function filterNotesByFavorite(notes: Note[], isFavorite?: boolean): Note[] {
  if (isFavorite === undefined) return notes;
  return notes.filter((note) => note.isFavorite === isFavorite);
}

// 根据删除状态筛选笔记
export function filterNotesByDeleted(notes: Note[], isDeleted: boolean = false): Note[] {
  return notes.filter((note) => note.isDeleted === isDeleted);
}

// 搜索笔记
export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;

  const searchTerm = query.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      (note.excerpt && note.excerpt.toLowerCase().includes(searchTerm))
  );
}

// 排序笔记
export function sortNotes(
  notes: Note[],
  sortBy: "updatedAt" | "createdAt" | "title" | "wordCount",
  sortOrder: "asc" | "desc" = "desc"
): Note[] {
  return [...notes].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "updatedAt":
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case "createdAt":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "wordCount":
        comparison = a.wordCount - b.wordCount;
        break;
      default:
        return 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
}

// 构建文件夹树
export function buildFolderTree(folders: Folder[]): Folder[] {
  const folderMap = new Map<string, Folder>();
  const rootFolders: Folder[] = [];

  // 创建文件夹映射
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // 构建树形结构
  folders.forEach((folder) => {
    const currentFolder = folderMap.get(folder.id)!;

    if (folder.parentId && folderMap.has(folder.parentId)) {
      const parentFolder = folderMap.get(folder.parentId)!;
      parentFolder.children!.push(currentFolder);
    } else {
      rootFolders.push(currentFolder);
    }
  });

  return rootFolders;
}

// 获取文件夹路径
export function getFolderPath(folders: Folder[], folderId: string): string[] {
  const folderMap = new Map(folders.map((f) => [f.id, f]));
  const path: string[] = [];

  let currentId: string | undefined = folderId;
  while (currentId && folderMap.has(currentId)) {
    const folder = folderMap.get(currentId)!;
    path.unshift(folder.name);
    currentId = folder.parentId;
  }

  return path;
}
