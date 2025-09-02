/**
 * 基础Service抽象类
 * 提供通用的业务逻辑方法
 */
export abstract class BaseService {
  /**
   * 验证必填字段
   */
  protected validateRequired(value: unknown, fieldName: string): void {
    if (value === undefined || value === null || value === "") {
      throw new Error(`${fieldName}是必填项`);
    }
  }

  /**
   * 验证字符串长度
   */
  protected validateStringLength(value: string, fieldName: string, minLength?: number, maxLength?: number): void {
    if (minLength !== undefined && value.length < minLength) {
      throw new Error(`${fieldName}长度不能少于${minLength}个字符`);
    }

    if (maxLength !== undefined && value.length > maxLength) {
      throw new Error(`${fieldName}长度不能超过${maxLength}个字符`);
    }
  }

  /**
   * 验证数组长度
   */
  protected validateArrayLength(value: unknown[], fieldName: string, minLength?: number, maxLength?: number): void {
    if (minLength !== undefined && value.length < minLength) {
      throw new Error(`${fieldName}数量不能少于${minLength}个`);
    }

    if (maxLength !== undefined && value.length > maxLength) {
      throw new Error(`${fieldName}数量不能超过${maxLength}个`);
    }
  }

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
