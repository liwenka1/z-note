/**
 * 笔记相关常量配置
 *
 * 注意：笔记创建和文件名处理等工具函数已移至 @renderer/types/file-content
 */
export const NOTE_CONSTANTS = {
  /**
   * 默认笔记文件版本
   */
  DEFAULT_VERSION: "1.0",

  /**
   * 默认笔记文件名前缀
   */
  DEFAULT_NOTE_PREFIX: "新建笔记",

  /**
   * 默认文件夹名前缀
   */
  DEFAULT_FOLDER_PREFIX: "新建文件夹",

  /**
   * 笔记文件扩展名
   */
  FILE_EXTENSION: ".json",

  /**
   * JSON格式化缩进
   */
  JSON_INDENT: 2
} as const;
