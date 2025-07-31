import type { Note, Folder, Tag, UserSettings, SearchHistory } from "@renderer/types";
import { createNoteData, generateId } from "@renderer/utils/data-utils";

// ==================== 标签数据 ====================
export const mockTags: Tag[] = [
  {
    id: "tag-1",
    name: "工作",
    color: "#3b82f6",
    description: "工作相关的笔记和任务",
    usageCount: 15,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "tag-2",
    name: "学习",
    color: "#22c55e",
    description: "学习笔记和知识总结",
    usageCount: 23,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-22")
  },
  {
    id: "tag-3",
    name: "React",
    color: "#06b6d4",
    description: "React 相关技术笔记",
    usageCount: 12,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-25")
  },
  {
    id: "tag-4",
    name: "TypeScript",
    color: "#8b5cf6",
    description: "TypeScript 学习和实践",
    usageCount: 8,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-28")
  },
  {
    id: "tag-5",
    name: "项目",
    color: "#ef4444",
    description: "项目相关文档和规划",
    usageCount: 6,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-30")
  },
  {
    id: "tag-6",
    name: "想法",
    color: "#f97316",
    description: "随机想法和灵感记录",
    usageCount: 9,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "tag-7",
    name: "教程",
    color: "#eab308",
    description: "技术教程和指南",
    usageCount: 4,
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-02-05")
  }
];

// ==================== 文件夹数据 ====================
export const mockFolders: Folder[] = [
  // 根级文件夹
  {
    id: "folder-1",
    name: "工作项目",
    color: "#3b82f6",
    icon: "💼",
    description: "所有工作相关的项目文档",
    isDeleted: false,
    isExpanded: true,
    sortOrder: 1,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "folder-2",
    name: "学习资料",
    color: "#22c55e",
    icon: "📚",
    description: "技术学习和知识管理",
    isDeleted: false,
    isExpanded: true,
    sortOrder: 2,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "folder-3",
    name: "个人笔记",
    color: "#ec4899",
    icon: "✨",
    description: "个人想法和生活记录",
    isDeleted: false,
    isExpanded: false,
    sortOrder: 3,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-20")
  },

  // 工作项目子文件夹
  {
    id: "folder-1-1",
    name: "Z-Note 项目",
    parentId: "folder-1",
    color: "#8b5cf6",
    icon: "📝",
    description: "笔记应用开发相关文档",
    isDeleted: false,
    isExpanded: true,
    sortOrder: 1,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-22")
  },
  {
    id: "folder-1-2",
    name: "客户项目",
    parentId: "folder-1",
    color: "#06b6d4",
    icon: "🏢",
    description: "客户项目相关文档",
    isDeleted: false,
    isExpanded: false,
    sortOrder: 2,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-25")
  },

  // 学习资料子文件夹
  {
    id: "folder-2-1",
    name: "前端开发",
    parentId: "folder-2",
    color: "#f97316",
    icon: "⚛️",
    description: "前端技术学习笔记",
    isDeleted: false,
    isExpanded: true,
    sortOrder: 1,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-28")
  },
  {
    id: "folder-2-2",
    name: "后端开发",
    parentId: "folder-2",
    color: "#84cc16",
    icon: "🛠️",
    description: "后端技术学习笔记",
    isDeleted: false,
    isExpanded: false,
    sortOrder: 2,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-30")
  },

  // 更深层次的嵌套
  {
    id: "folder-2-1-1",
    name: "React 生态",
    parentId: "folder-2-1",
    color: "#06b6d4",
    icon: "⚛️",
    description: "React 及相关技术栈",
    isDeleted: false,
    isExpanded: false,
    sortOrder: 1,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-01")
  }
];

// ==================== 笔记数据 ====================
export const mockNotes: Note[] = [
  // Z-Note 项目相关笔记
  createNoteData({
    title: "Z-Note 项目规划",
    content: `# Z-Note 项目规划

## 项目概述
Z-Note 是一个现代化的笔记应用，基于 Electron + React + TypeScript 构建。

## 核心功能
- ✅ Notion 风格的左侧导航
- ✅ 主题切换功能
- ✅ 全局搜索
- 🚧 笔记编辑器
- 🚧 文件夹管理
- 📋 标签系统

## 技术栈
- **前端**: React 18 + TypeScript
- **路由**: TanStack Router
- **状态管理**: Zustand
- **UI库**: shadcn/ui + Tailwind CSS
- **桌面端**: Electron

## 开发计划
1. 完成前端静态页面开发
2. 实现笔记编辑和管理功能
3. 开发后端 API
4. 数据同步和备份功能

项目预计开发周期：4-6周`,
    folderId: "folder-1-1",
    tags: ["tag-5", "tag-3"]
  }),

  createNoteData({
    title: "技术选型分析",
    content: `# 技术选型分析

## 前端框架选择

### React vs Vue vs Angular
经过调研，最终选择 React 的原因：
1. **生态丰富**: 庞大的社区和丰富的第三方库
2. **TypeScript 支持**: 官方支持，类型安全
3. **性能优秀**: Virtual DOM 和 Hooks 优化
4. **团队熟悉度**: 团队对 React 更加熟悉

### 状态管理选择
- **Zustand** vs Redux Toolkit
- 选择 Zustand 的原因：
  - 轻量级，bundle 大小更小
  - API 简洁，学习成本低
  - TypeScript 支持友好
  - 适合中小型项目

## 路由选择
TanStack Router 相比 React Router 的优势：
- 类型安全的路由
- 更好的 TypeScript 支持
- 内置的 loader 机制

## UI 组件库
shadcn/ui + Tailwind CSS 组合：
- 组件质量高，设计统一
- 可定制性强
- 与 Tailwind CSS 完美集成`,
    folderId: "folder-1-1",
    tags: ["tag-3", "tag-4", "tag-2"]
  }),

  // React 学习笔记
  createNoteData({
    title: "React 18 新特性详解",
    content: `# React 18 新特性详解

## Concurrent Features

### 1. Automatic Batching
React 18 中，所有更新都会自动批处理，包括在 Promise、setTimeout 等异步操作中的更新。

\`\`\`javascript
// React 18 之前
setTimeout(() => {
  setCount(c => c + 1); // 触发一次渲染
  setFlag(f => !f);     // 触发一次渲染
}, 1000);

// React 18
setTimeout(() => {
  setCount(c => c + 1); // 不会立即渲染
  setFlag(f => !f);     // 只会在最后触发一次渲染
}, 1000);
\`\`\`

### 2. Suspense 改进
\`\`\`jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### 3. startTransition
用于标记非紧急更新：

\`\`\`javascript
import { startTransition } from 'react';

function handleClick() {
  // 紧急更新
  setInputValue(input);
  
  // 非紧急更新
  startTransition(() => {
    setSearchResults(results);
  });
}
\`\`\`

## New Hooks

### useDeferredValue
延迟更新值，用于优化性能：

\`\`\`javascript
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  return <Results query={deferredQuery} />;
}
\`\`\`

### useId
生成唯一的 ID：

\`\`\`javascript
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <input id={id + '-firstName'} type="text" />
    </div>
  );
}
\`\`\``,
    folderId: "folder-2-1-1",
    tags: ["tag-3", "tag-2", "tag-7"]
  }),

  createNoteData({
    title: "TypeScript 高级类型技巧",
    content: `# TypeScript 高级类型技巧

## 1. 条件类型 (Conditional Types)

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<string>;   // false
\`\`\`

## 2. 映射类型 (Mapped Types)

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 3. 模板字面量类型

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type Click = EventName<'click'>; // 'onClick'
type Focus = EventName<'focus'>; // 'onFocus'
\`\`\`

## 4. infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type Func = () => string;
type Result = ReturnType<Func>; // string
\`\`\`

## 5. 递归类型

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};
\`\`\`

## 实际应用场景

### API 响应类型生成
\`\`\`typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

type UserResponse = ApiResponse<User>;
type PostsResponse = ApiResponse<Post[]>;
\`\`\``,
    folderId: "folder-2-1",
    tags: ["tag-4", "tag-2", "tag-7"]
  }),

  // 工作相关笔记
  createNoteData({
    title: "每日工作日志 - 2024年1月",
    content: `# 每日工作日志 - 2024年1月

## 1月30日
### 完成任务
- ✅ 完成用户管理模块的前端页面
- ✅ 修复登录页面的响应式布局问题
- ✅ 优化首页加载性能，减少首屏时间20%

### 遇到问题
- 第三方 API 接口偶尔超时，需要添加重试机制
- 表格组件在 Safari 中样式异常

### 明日计划
- 实现密码重置功能
- 处理 Safari 兼容性问题
- 编写单元测试

## 1月29日
### 完成任务
- ✅ 重构了组件库的按钮组件
- ✅ 更新了 ESLint 配置
- ✅ 参与代码评审，提出3个改进建议

### 学习内容
- 深入了解了 React Server Components
- 学习了 Webpack 5 的新特性

## 1月28日
### 完成任务
- ✅ 集成了新的支付接口
- ✅ 完成移动端适配
- ✅ 修复了6个 bug

### 技术要点
- 使用 React Query 优化数据获取
- 实现了虚拟滚动提升长列表性能`,
    folderId: "folder-1",
    tags: ["tag-1", "tag-3"]
  }),

  // 个人想法和灵感
  createNoteData({
    title: "关于知识管理的思考",
    content: `# 关于知识管理的思考

## 为什么需要知识管理？

在这个信息爆炸的时代，我们每天都会接触到大量的信息：
- 技术文档和教程
- 项目经验和踩坑记录
- 灵感和想法
- 学习笔记和总结

如果没有一个好的管理系统，这些宝贵的知识很容易：
1. **丢失**: 记录在各种地方，需要时找不到
2. **重复**: 同样的问题重复踩坑
3. **碎片化**: 知识点之间缺乏关联
4. **过时**: 没有及时更新，信息陈旧

## 理想的知识管理系统特点

### 1. 统一的信息存储
所有信息都存储在一个地方，避免分散在多个工具中。

### 2. 强大的搜索功能
- 全文搜索
- 标签分类
- 时间范围筛选

### 3. 灵活的组织方式
- 文件夹层级结构
- 标签系统
- 双向链接

### 4. 便捷的记录方式
- Markdown 支持
- 快捷键操作
- 模板功能

## Z-Note 的设计理念

基于以上思考，Z-Note 的设计理念是：
- **简洁**: 专注于核心功能，避免功能臃肿
- **高效**: 快速记录，快速查找
- **灵活**: 支持多种组织方式
- **美观**: 现代化的界面设计

希望能打造一个真正好用的知识管理工具！`,
    folderId: "folder-3",
    tags: ["tag-6", "tag-5"]
  }),

  // 教程类笔记
  createNoteData({
    title: "Git 进阶使用技巧",
    content: `# Git 进阶使用技巧

## 1. 交互式变基 (Interactive Rebase)

\`\`\`bash
# 修改最近3次提交
git rebase -i HEAD~3
\`\`\`

可选操作：
- \`pick\`: 使用提交
- \`reword\`: 修改提交信息
- \`edit\`: 修改提交内容
- \`squash\`: 合并到上一个提交
- \`drop\`: 删除提交

## 2. 选择性暂存 (Staging)

\`\`\`bash
# 交互式暂存文件的部分内容
git add -p filename

# 暂存所有已修改的文件
git add -u

# 查看暂存区和工作目录的差异
git diff --staged
\`\`\`

## 3. 储藏 (Stash) 高级用法

\`\`\`bash
# 储藏包括未跟踪的文件
git stash -u

# 储藏时添加描述
git stash save "修复登录bug的临时代码"

# 查看储藏列表
git stash list

# 应用指定的储藏
git stash apply stash@{2}

# 将储藏应用为新分支
git stash branch new-feature stash@{1}
\`\`\`

## 4. 分支管理技巧

\`\`\`bash
# 查看已合并的分支
git branch --merged

# 查看未合并的分支
git branch --no-merged

# 删除远程分支
git push origin --delete feature-branch

# 重命名分支
git branch -m old-name new-name
\`\`\`

## 5. 查找和调试

\`\`\`bash
# 查找引入bug的提交
git bisect start
git bisect bad HEAD
git bisect good v1.0

# 查看文件的每一行最后修改信息
git blame filename

# 查看文件的修改历史
git log -p filename
\`\`\`

## 6. 高级配置

\`\`\`bash
# 设置全局 .gitignore
git config --global core.excludesfile ~/.gitignore

# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
\`\`\``,
    folderId: "folder-2",
    tags: ["tag-7", "tag-2"]
  }),

  // 更多示例笔记...
  createNoteData({
    title: "Electron 开发经验总结",
    content: `# Electron 开发经验总结

## 项目结构建议

\`\`\`
src/
  main/        # 主进程
  renderer/    # 渲染进程
  preload/     # 预加载脚本
  shared/      # 共享代码
\`\`\`

## 主要踩坑点

### 1. 安全性配置
\`\`\`javascript
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  preload: path.join(__dirname, 'preload.js')
}
\`\`\`

### 2. 进程间通信
使用 contextBridge API：
\`\`\`javascript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
});
\`\`\`

### 3. 打包配置
electron-builder 配置要点：
- 配置正确的文件路径
- 处理原生依赖
- 配置代码签名

## 性能优化建议
1. 合理使用进程隔离
2. 避免阻塞主进程
3. 使用 worker 处理密集计算
4. 合理管理内存使用`,
    folderId: "folder-1-1",
    tags: ["tag-1", "tag-2"]
  }),

  // 删除的笔记示例
  {
    ...createNoteData({
      title: "已删除的测试笔记",
      content: "这是一个已删除的笔记，用于测试垃圾箱功能。",
      folderId: "folder-3",
      tags: ["tag-6"]
    }),
    isDeleted: true,
    updatedAt: new Date("2024-01-25")
  },

  // 收藏的笔记
  {
    ...createNoteData({
      title: "重要的架构设计文档",
      content: `# 系统架构设计

## 整体架构图
[架构图占位]

## 核心模块
1. 用户管理模块
2. 内容管理模块  
3. 搜索模块
4. 数据存储模块

## 技术选型
- 前端：React + TypeScript
- 后端：Node.js + Express
- 数据库：PostgreSQL
- 缓存：Redis`,
      folderId: "folder-1",
      tags: ["tag-1", "tag-5"]
    }),
    isFavorite: true
  }
];

// 设置一些笔记的查看时间
mockNotes.forEach((note, index) => {
  if (index < 5) {
    note.lastViewedAt = new Date(Date.now() - index * 24 * 60 * 60 * 1000);
  }
});

// ==================== 用户设置 ====================
export const mockUserSettings: UserSettings = {
  id: "user-settings-1",
  theme: "system",
  fontSize: 14,
  fontFamily: "Source Code Pro, Consolas, monospace",
  editorMode: "split",
  autoSave: true,
  autoSaveInterval: 30,
  sidebarWidth: 280,
  showLineNumbers: true,
  wordWrap: true,
  defaultFolderId: "folder-1",
  recentNoteIds: mockNotes.slice(0, 5).map((note) => note.id),
  pinnedNoteIds: mockNotes.filter((note) => note.isFavorite).map((note) => note.id)
};

// ==================== 搜索历史 ====================
export const mockSearchHistory: SearchHistory[] = [
  {
    id: generateId(),
    query: "React 18",
    searchType: "all",
    resultCount: 3,
    searchedAt: new Date("2024-01-30T10:30:00")
  },
  {
    id: generateId(),
    query: "TypeScript",
    searchType: "content",
    resultCount: 5,
    searchedAt: new Date("2024-01-30T09:15:00")
  },
  {
    id: generateId(),
    query: "工作",
    searchType: "tag",
    resultCount: 8,
    searchedAt: new Date("2024-01-29T16:45:00")
  },
  {
    id: generateId(),
    query: "项目规划",
    searchType: "title",
    resultCount: 2,
    searchedAt: new Date("2024-01-29T14:20:00")
  },
  {
    id: generateId(),
    query: "Git",
    searchType: "all",
    resultCount: 1,
    searchedAt: new Date("2024-01-28T11:30:00")
  }
];

// ==================== 导出所有数据 ====================
export const mockData = {
  notes: mockNotes,
  folders: mockFolders,
  tags: mockTags,
  userSettings: mockUserSettings,
  searchHistory: mockSearchHistory
};
