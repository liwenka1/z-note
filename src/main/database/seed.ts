import { getDatabase } from "./db";
import { tags, notes, chats, marks } from "./schema";

// 初始数据
export async function seedDatabase() {
  const db = getDatabase();

  console.log("开始插入初始数据...");

  try {
    // 清空现有数据（开发阶段）
    await db.delete(marks);
    await db.delete(chats);
    await db.delete(notes);
    await db.delete(tags);

    // 插入标签数据（包含默认的 Idea 标签）
    const tagData = [
      {
        id: 1,
        name: "Idea",
        isLocked: true,
        isPin: true
      },
      {
        id: 2,
        name: "开发",
        isLocked: false,
        isPin: false
      },
      {
        id: 3,
        name: "TypeScript",
        isLocked: false,
        isPin: false
      },
      {
        id: 4,
        name: "Electron",
        isLocked: false,
        isPin: false
      },
      {
        id: 5,
        name: "学习",
        isLocked: false,
        isPin: true
      },
      {
        id: 6,
        name: "重要",
        isLocked: false,
        isPin: false
      }
    ];

    await db.insert(tags).values(tagData);
    console.log("✅ 标签数据插入成功");

    // 插入笔记数据
    const noteData = [
      {
        id: 1,
        tagId: 1,
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
2. 标签系统
3. 富文本编辑
4. 搜索功能`,
        locale: "zh-CN",
        count: "300",
        createdAt: Date.now()
      },
      {
        id: 2,
        tagId: 3,
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
        locale: "zh-CN",
        count: "250",
        createdAt: Date.now()
      },
      {
        id: 3,
        tagId: 5,
        content: `# 今日想法

今天学习了 Drizzle ORM，感觉这个工具真的很棒！

## 优点
- 类型安全
- 性能优秀
- API 简洁
- 迁移方便

## 对比其他 ORM
相比 TypeORM 和 Prisma，Drizzle 更轻量，启动速度更快。`,
        locale: "zh-CN",
        count: "120",
        createdAt: Date.now()
      }
    ];

    await db.insert(notes).values(noteData);
    console.log("✅ 笔记数据插入成功");

    // 插入聊天数据
    const chatData = [
      {
        id: 1,
        tagId: 1,
        content: "你好，我想了解一下这个项目的进展",
        role: "user" as const,
        type: "chat" as const,
        inserted: false,
        createdAt: Date.now()
      },
      {
        id: 2,
        tagId: 1,
        content: "项目目前进展顺利，已经完成了基础架构的搭建",
        role: "system" as const,
        type: "chat" as const,
        inserted: false,
        createdAt: Date.now()
      },
      {
        id: 3,
        tagId: 2,
        content: "可以帮我生成一个 TypeScript 接口吗？",
        role: "user" as const,
        type: "note" as const,
        inserted: true,
        createdAt: Date.now()
      }
    ];

    await db.insert(chats).values(chatData);
    console.log("✅ 聊天数据插入成功");

    // 插入标记数据
    const markData = [
      {
        id: 1,
        tagId: 1,
        type: "text" as const,
        content: "重要的会议记录",
        desc: "今天的项目会议记录",
        deleted: 0,
        createdAt: Date.now()
      },
      {
        id: 2,
        tagId: 2,
        type: "link" as const,
        url: "https://www.typescriptlang.org/",
        desc: "TypeScript 官方文档",
        deleted: 0,
        createdAt: Date.now()
      },
      {
        id: 3,
        tagId: 4,
        type: "file" as const,
        content: "project-plan.pdf",
        desc: "项目计划文档",
        deleted: 0,
        createdAt: Date.now()
      },
      {
        id: 4,
        tagId: 1,
        type: "text" as const,
        content: "已删除的标记",
        desc: "这是一个已删除的标记",
        deleted: 1,
        createdAt: Date.now()
      }
    ];

    await db.insert(marks).values(markData);
    console.log("✅ 标记数据插入成功");

    console.log("🎉 所有初始数据插入完成！");
  } catch (error) {
    console.error("❌ 插入初始数据失败:", error);
    throw error;
  }
}
