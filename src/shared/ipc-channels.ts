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
  },

  // 文件系统相关
  FILE_SYSTEM: {
    SCAN_DIRECTORY: "fileSystem:scanDirectory",
    READ_FILE: "fileSystem:readFile",
    WRITE_FILE: "fileSystem:writeFile",
    CREATE_DIRECTORY: "fileSystem:createDirectory",
    DELETE_FILE: "fileSystem:deleteFile",
    RENAME_FILE: "fileSystem:renameFile",
    MOVE_FILE: "fileSystem:moveFile",
    COPY_FILE: "fileSystem:copyFile",
    EXISTS: "fileSystem:exists",
    GET_STATS: "fileSystem:getStats",
    CREATE_UNIQUE_FILENAME: "fileSystem:createUniqueFileName",
    GET_DIRECTORY_SIZE: "fileSystem:getDirectorySize",
    WATCH_DIRECTORY: "fileSystem:watchDirectory",
    SEARCH_FILES: "fileSystem:searchFiles"
  },

  // 工作区相关
  WORKSPACE: {
    GET_DEFAULT_PATH: "workspace:getDefaultPath",
    GET_CONFIG: "workspace:getConfig",
    SET_CONFIG: "workspace:setConfig",
    SELECT_DIRECTORY: "workspace:selectDirectory",
    VALIDATE_WORKSPACE: "workspace:validateWorkspace"
  },

  // 应用配置相关
  CONFIG: {
    GET: "config:get",
    SET: "config:set",
    REMOVE: "config:remove",
    GET_ALL: "config:getAll"
  },

  // 系统Shell操作相关
  SHELL: {
    SHOW_ITEM_IN_FOLDER: "shell:showItemInFolder",
    OPEN_PATH: "shell:openPath",
    OPEN_EXTERNAL: "shell:openExternal"
  },

  // AI 相关
  AI: {
    CHAT: "ai:chat",
    CHAT_STREAM: "ai:chat-stream",
    ABORT_STREAM: "ai:abort-stream"
  }
} as const;
