/**
 * 基础Service抽象类
 * 提供通用的业务逻辑方法
 */
export abstract class BaseService {
  /**
   * 清理HTML标签
   */
  protected stripHtml(content: string): string {
    return content.replace(/<[^>]*>/g, "");
  }

  /**
   * 生成摘要
   */
  protected generateExcerpt(content: string, maxLength = 150): string {
    const cleaned = this.stripHtml(content).trim();
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    return cleaned.substring(0, maxLength).trim() + "...";
  }

  /**
   * 格式化文件大小
   */
  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * 延迟执行
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 重试机制
   */
  protected async retry<T>(operation: () => Promise<T>, maxAttempts = 3, delayMs = 1000): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");

        if (attempt === maxAttempts) {
          break;
        }

        await this.delay(delayMs * attempt);
      }
    }

    throw lastError;
  }
}
