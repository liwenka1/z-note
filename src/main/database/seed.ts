import { getDatabase } from "./db";
import { tags, notes, chats, marks } from "./schema";

// 初始数据
export async function seedDatabase() {
  const db = getDatabase();

  console.log("开始插入初始数据...");

  try {
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
        content: `<h1>Z-Note 项目规划</h1><h2>项目概述</h2><p>Z-Note 是一个基于 Electron 的现代化笔记应用，支持丰富的文本编辑功能。</p><h2>技术栈</h2><ul><li><strong>前端</strong>: React + TypeScript + TanStack Router</li><li><strong>后端</strong>: Electron Main Process + SQLite + Drizzle ORM</li><li><strong>编辑器</strong>: TipTap</li><li><strong>UI</strong>: Tailwind CSS + shadcn/ui</li></ul><h2>核心功能</h2><ol><li>笔记管理</li><li>标签系统</li><li>富文本编辑</li><li>搜索功能</li></ol>`,
        locale: "zh-CN",
        count: "300",
        createdAt: Date.now()
      },
      {
        id: 2,
        tagId: 3,
        content: `<h1>TypeScript 学习笔记</h1><h2>基础类型</h2><ul><li>string, number, boolean</li><li>Array, Tuple</li><li>Enum, Any, Unknown</li><li>Void, Null, Undefined</li></ul><h2>高级类型</h2><ul><li>Union Types</li><li>Intersection Types</li><li>Conditional Types</li><li>Mapped Types</li></ul><h2>工具类型</h2><ul><li><code>Partial&lt;T&gt;</code></li><li><code>Required&lt;T&gt;</code></li><li><code>Pick&lt;T, K&gt;</code></li><li><code>Omit&lt;T, K&gt;</code></li></ul>`,
        locale: "zh-CN",
        count: "250",
        createdAt: Date.now()
      },
      {
        id: 3,
        tagId: 5,
        content: `<h1>今日想法</h1><p>今天学习了 <strong>Drizzle ORM</strong>，感觉这个工具真的很棒！</p><h2>优点</h2><ul><li>类型安全</li><li>性能优秀</li><li>API 简洁</li><li>迁移方便</li></ul><h2>对比其他 ORM</h2><p>相比 <em>TypeORM</em> 和 <em>Prisma</em>，Drizzle 更轻量，启动速度更快。</p><blockquote><p>推荐在新项目中使用 Drizzle ORM！</p></blockquote>`,
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
