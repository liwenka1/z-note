import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

// 获取数据库文件路径
function getDatabasePath(): string {
  const userDataPath = app.getPath("userData");
  const dbDir = path.join(userDataPath, "data");

  // 确保数据目录存在
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return path.join(dbDir, "app.db");
}

// 创建数据库连接
let db: ReturnType<typeof drizzle> | null = null;
let sqlite: Database.Database | null = null;

export function getDatabase() {
  if (!db || !sqlite) {
    const dbPath = getDatabasePath();

    try {
      sqlite = new Database(dbPath);
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");

      db = drizzle(sqlite, { schema });

      // 直接创建表结构
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS tags (
          id integer PRIMARY KEY AUTOINCREMENT,
          name text NOT NULL,
          isLocked integer DEFAULT 0 NOT NULL,
          isPin integer DEFAULT 0 NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notes (
          id integer PRIMARY KEY AUTOINCREMENT,
          tagId integer NOT NULL,
          content text DEFAULT NULL,
          locale text NOT NULL,
          count text NOT NULL,
          createdAt integer NOT NULL,
          FOREIGN KEY (tagId) REFERENCES tags(id)
        );

        CREATE TABLE IF NOT EXISTS chats (
          id integer PRIMARY KEY AUTOINCREMENT,
          tagId integer NOT NULL,
          content text DEFAULT NULL,
          role text NOT NULL,
          type text NOT NULL,
          image text DEFAULT NULL,
          inserted integer DEFAULT 0 NOT NULL,
          createdAt integer NOT NULL,
          FOREIGN KEY (tagId) REFERENCES tags(id)
        );

        CREATE TABLE IF NOT EXISTS marks (
          id integer PRIMARY KEY AUTOINCREMENT,
          tagId integer NOT NULL,
          type text NOT NULL,
          content text DEFAULT NULL,
          url text DEFAULT NULL,
          desc text DEFAULT NULL,
          deleted integer DEFAULT 0 NOT NULL,
          createdAt integer,
          FOREIGN KEY (tagId) REFERENCES tags(id)
        );

        CREATE TABLE IF NOT EXISTS vector_documents (
          id integer PRIMARY KEY AUTOINCREMENT,
          filename text NOT NULL,
          chunk_id integer NOT NULL,
          content text NOT NULL,
          embedding text NOT NULL,
          updated_at integer NOT NULL,
          UNIQUE(filename, chunk_id)
        );

        -- 创建向量文档索引
        CREATE INDEX IF NOT EXISTS idx_vector_documents_filename 
        ON vector_documents(filename);

        -- 插入默认的 "Idea" 标签
        INSERT OR IGNORE INTO tags (id, name, isLocked, isPin) 
        VALUES (1, 'Idea', 1, 1);
      `);
    } catch (error) {
      console.error("❌ 数据库初始化失败:", error);
      throw error;
    }
  }

  return db;
}

export function closeDatabase() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    db = null;
  }
}

// 应用退出时关闭数据库
app.on("before-quit", () => {
  closeDatabase();
});

/**
 * 初始化数据库（创建表结构）
 */
export function initialize(): Promise<void> {
  return new Promise((resolve) => {
    // 获取数据库连接，这会自动创建表结构
    getDatabase();
    resolve();
  });
}
