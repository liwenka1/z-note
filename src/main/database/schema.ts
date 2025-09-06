import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ==================== 标签表 (核心分类表) ====================
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  isLocked: integer("isLocked", { mode: "boolean" }).notNull().default(false),
  isPin: integer("isPin", { mode: "boolean" }).notNull().default(false)
});

// ==================== 笔记表 ====================
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tagId: integer("tagId")
    .notNull()
    .references(() => tags.id),
  content: text("content"),
  locale: text("locale").notNull(),
  count: text("count").notNull(),
  createdAt: integer("createdAt").notNull()
});

// ==================== 聊天记录表 ====================
export const chats = sqliteTable("chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tagId: integer("tagId")
    .notNull()
    .references(() => tags.id),
  content: text("content"),
  role: text("role").notNull(), // 'system' | 'user'
  type: text("type").notNull(), // 'chat' | 'note' | 'clipboard' | 'clear'
  image: text("image"),
  inserted: integer("inserted", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("createdAt").notNull()
});

// ==================== 标记收藏表 ====================
export const marks = sqliteTable("marks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tagId: integer("tagId")
    .notNull()
    .references(() => tags.id),
  type: text("type").notNull(), // 'scan' | 'text' | 'image' | 'link' | 'file'
  content: text("content"),
  url: text("url"),
  desc: text("desc"),
  deleted: integer("deleted").notNull().default(0),
  createdAt: integer("createdAt")
});

// ==================== 向量数据库表 ====================
export const vectorDocuments = sqliteTable("vector_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  chunkId: integer("chunk_id").notNull(),
  content: text("content").notNull(),
  embedding: text("embedding").notNull(),
  updatedAt: integer("updated_at").notNull()
});

// ==================== 关系定义 ====================
export const tagsRelations = relations(tags, ({ many }) => ({
  notes: many(notes),
  chats: many(chats),
  marks: many(marks)
}));

export const notesRelations = relations(notes, ({ one }) => ({
  tag: one(tags, {
    fields: [notes.tagId],
    references: [tags.id]
  })
}));

export const chatsRelations = relations(chats, ({ one }) => ({
  tag: one(tags, {
    fields: [chats.tagId],
    references: [tags.id]
  })
}));

export const marksRelations = relations(marks, ({ one }) => ({
  tag: one(tags, {
    fields: [marks.tagId],
    references: [tags.id]
  })
}));
