// src/shared/ipc-channels.ts
export const IPC_CHANNELS = {
  // 数据库相关
  DB: {
    INIT: "db:init"
  },

  // Tags 相关
  TAGS: {
    GET_ALL: "tags:getAll",
    CREATE: "tags:create",
    UPDATE: "tags:update",
    DELETE: "tags:delete",
    DELETE_ALL: "tags:deleteAll"
  },

  // Notes 相关
  NOTES: {
    GET_BY_TAG: "notes:getByTag",
    GET_BY_ID: "notes:getById",
    CREATE: "notes:create",
    DELETE: "notes:delete"
  },

  // Chats 相关
  CHATS: {
    GET_BY_TAG: "chats:getByTag",
    CREATE: "chats:create",
    UPDATE: "chats:update",
    DELETE: "chats:delete",
    CLEAR_BY_TAG: "chats:clearByTag",
    UPDATE_INSERTED: "chats:updateInserted"
  },

  // Marks 相关
  MARKS: {
    GET_BY_TAG: "marks:getByTag",
    GET_ALL: "marks:getAll",
    CREATE: "marks:create",
    UPDATE: "marks:update",
    DELETE: "marks:delete",
    RESTORE: "marks:restore",
    DELETE_FOREVER: "marks:deleteForever",
    CLEAR_TRASH: "marks:clearTrash"
  },

  // Vector Documents 相关
  VECTOR: {
    INIT: "vector:init",
    UPSERT: "vector:upsert",
    GET_BY_FILENAME: "vector:getByFilename",
    DELETE_BY_FILENAME: "vector:deleteByFilename",
    GET_SIMILAR: "vector:getSimilar",
    CLEAR: "vector:clear"
  }
} as const;
