import { toast } from "sonner";

// 错误类型枚举
export enum ErrorType {
  NETWORK = "network",
  VALIDATION = "validation",
  PERMISSION = "permission",
  NOT_FOUND = "not_found",
  UNKNOWN = "unknown"
}

// 错误分类器
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// 统一错误处理器
export class ErrorHandler {
  /**
   * 处理错误并显示用户友好的提示
   */
  static handle(error: unknown, context?: string): void {
    const errorInfo = this.parseError(error);

    // 记录错误日志
    console.error(`[${context || "Unknown"}]`, {
      message: errorInfo.message,
      type: errorInfo.type,
      code: errorInfo.code,
      originalError: error
    });

    // 显示用户提示
    this.showUserMessage(errorInfo);
  }

  /**
   * 解析错误信息
   */
  private static parseError(error: unknown): {
    message: string;
    type: ErrorType;
    code?: string;
  } {
    if (error instanceof AppError) {
      return {
        message: error.message,
        type: error.type,
        code: error.code
      };
    }

    if (error instanceof Error) {
      // 根据错误消息判断类型
      if (error.message.includes("网络") || error.message.includes("连接")) {
        return {
          message: "网络连接失败，请检查网络设置",
          type: ErrorType.NETWORK
        };
      }

      if (error.message.includes("不存在") || error.message.includes("未找到")) {
        return {
          message: error.message,
          type: ErrorType.NOT_FOUND
        };
      }

      if (error.message.includes("权限") || error.message.includes("无法访问")) {
        return {
          message: "权限不足，无法执行该操作",
          type: ErrorType.PERMISSION
        };
      }

      return {
        message: error.message,
        type: ErrorType.UNKNOWN
      };
    }

    return {
      message: "操作失败，请重试",
      type: ErrorType.UNKNOWN
    };
  }

  /**
   * 显示用户消息
   */
  private static showUserMessage(errorInfo: { message: string; type: ErrorType; code?: string }): void {
    const options = {
      duration: 4000
    };

    switch (errorInfo.type) {
      case ErrorType.NETWORK:
        toast.error("网络错误", {
          description: errorInfo.message,
          ...options
        });
        break;

      case ErrorType.VALIDATION:
        toast.warning("输入错误", {
          description: errorInfo.message,
          ...options
        });
        break;

      case ErrorType.PERMISSION:
        toast.error("权限错误", {
          description: errorInfo.message,
          ...options
        });
        break;

      case ErrorType.NOT_FOUND:
        toast.error("资源不存在", {
          description: errorInfo.message,
          ...options
        });
        break;

      default:
        toast.error("操作失败", {
          description: errorInfo.message,
          ...options
        });
    }
  }

  /**
   * 显示成功消息
   */
  static success(message: string, description?: string): void {
    toast.success(message, {
      description,
      duration: 3000
    });
  }

  /**
   * 显示信息消息
   */
  static info(message: string, description?: string): void {
    toast.info(message, {
      description,
      duration: 3000
    });
  }

  /**
   * 显示警告消息
   */
  static warning(message: string, description?: string): void {
    toast.warning(message, {
      description,
      duration: 4000
    });
  }
}
