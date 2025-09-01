import { getDatabase } from "./db";
import { folders, tags, notes, noteTags } from "./schema";

// 初始数据
export async function seedDatabase() {
  const db = getDatabase();

  console.log("开始插入初始数据...");

  try {
    // 清空现有数据（开发阶段）
    await db.delete(noteTags);
    await db.delete(notes);
    await db.delete(tags);
    await db.delete(folders);

    // 插入文件夹数据
    const folderData = [
      {
        id: "folder-1",
        name: "工作项目",
        parentId: null,
        color: "#3b82f6",
        icon: "💼",
        isDeleted: false,
        sortOrder: 1,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-15")
      },
      {
        id: "folder-2",
        name: "学习资料",
        parentId: null,
        color: "#22c55e",
        icon: "📚",
        isDeleted: false,
        sortOrder: 2,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-18")
      },
      {
        id: "folder-3",
        name: "个人笔记",
        parentId: null,
        color: "#ec4899",
        icon: "✨",
        isDeleted: false,
        sortOrder: 3,
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-20")
      },
      // 子文件夹
      {
        id: "folder-1-1",
        name: "Z-Note 项目",
        parentId: "folder-1",
        color: "#8b5cf6",
        icon: "📝",
        isDeleted: false,
        sortOrder: 1,
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-22")
      },
      {
        id: "folder-2-1",
        name: "TypeScript",
        parentId: "folder-2",
        color: "#3b82f6",
        icon: "📘",
        isDeleted: false,
        sortOrder: 1,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-25")
      }
    ];

    await db.insert(folders).values(folderData);
    console.log("✅ 文件夹数据插入成功");

    // 插入标签数据
    const tagData = [
      {
        id: "tag-1",
        name: "开发",
        color: "#3b82f6",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10")
      },
      {
        id: "tag-2",
        name: "TypeScript",
        color: "#0ea5e9",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10")
      },
      {
        id: "tag-3",
        name: "Electron",
        color: "#22c55e",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10")
      },
      {
        id: "tag-4",
        name: "学习",
        color: "#f59e0b",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10")
      },
      {
        id: "tag-5",
        name: "重要",
        color: "#ef4444",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10")
      }
    ];

    await db.insert(tags).values(tagData);
    console.log("✅ 标签数据插入成功");

    // 插入笔记数据
    const noteData = [
      {
        id: "note-1",
        title: "Z-Note 项目规划",
        content: `# Z-Note 项目规划

## 项目概述
Z-Note 是一个基于 Electron 的现代化笔记应用，支持丰富的文本编辑功能。

## 技术栈
- **前端**: React + TypeScript + TanStack Router
- **后端**: Electron Main Process + SQLite + Drizzle ORM
- **编辑器**: TipTap
- **UI**: Tailwind CSS + shadcn/ui

## 核心功能
1. 笔记管理
2. 文件夹组织
3. 标签系统
4. 富文本编辑
5. 搜索功能`,
        folderId: "folder-1-1",
        isFavorite: true,
        isDeleted: false,
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-28")
      },
      {
        id: "note-2",
        title: "TypeScript 学习笔记",
        content: `# TypeScript 学习笔记

## 基础类型
- string, number, boolean
- Array, Tuple
- Enum, Any, Unknown
- Void, Null, Undefined

## 高级类型
- Union Types
- Intersection Types
- Conditional Types
- Mapped Types

## 工具类型
- Partial<T>
- Required<T>
- Pick<T, K>
- Omit<T, K>`,
        folderId: "folder-2-1",
        isFavorite: false,
        isDeleted: false,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-25")
      },
      {
        id: "note-3",
        title: "今日想法",
        content: `# 今日想法

今天学习了 Drizzle ORM，感觉这个工具真的很棒！

## 优点
- 类型安全
- 性能优秀
- API 简洁
- 迁移方便

## 对比其他 ORM
相比 TypeORM 和 Prisma，Drizzle 更轻量，启动速度更快。`,
        folderId: "folder-3",
        isFavorite: false,
        isDeleted: false,
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-22")
      }
    ];

    await db.insert(notes).values(noteData);
    console.log("✅ 笔记数据插入成功");

    // 插入笔记标签关联数据
    const noteTagData = [
      { noteId: "note-1", tagId: "tag-1" },
      { noteId: "note-1", tagId: "tag-3" },
      { noteId: "note-1", tagId: "tag-5" },
      { noteId: "note-2", tagId: "tag-2" },
      { noteId: "note-2", tagId: "tag-4" },
      { noteId: "note-3", tagId: "tag-4" }
    ];

    await db.insert(noteTags).values(noteTagData);
    console.log("✅ 笔记标签关联数据插入成功");

    console.log("🎉 所有初始数据插入完成！");
  } catch (error) {
    console.error("❌ 插入初始数据失败:", error);
    throw error;
  }
}
