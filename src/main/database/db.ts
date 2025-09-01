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
        CREATE TABLE IF NOT EXISTS folders (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL,
          parent_id text,
          color text,
          icon text,
          is_deleted integer DEFAULT false NOT NULL,
          sort_order integer DEFAULT 0 NOT NULL,
          created_at integer NOT NULL,
          updated_at integer NOT NULL,
          FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE cascade
        );

        CREATE TABLE IF NOT EXISTS tags (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL UNIQUE,
          color text NOT NULL,
          created_at integer NOT NULL,
          updated_at integer NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notes (
          id text PRIMARY KEY NOT NULL,
          title text NOT NULL,
          content text NOT NULL,
          folder_id text,
          is_favorite integer DEFAULT false NOT NULL,
          is_deleted integer DEFAULT false NOT NULL,
          created_at integer NOT NULL,
          updated_at integer NOT NULL,
          FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE set null
        );

        CREATE TABLE IF NOT EXISTS note_tags (
          note_id text NOT NULL,
          tag_id text NOT NULL,
          FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE cascade,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE cascade
        );
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
