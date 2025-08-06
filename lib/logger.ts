import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type LogSeverity = "info" | "warn" | "error" | "critical";

export interface ErrorLogData {
  errorMessage: string;
  errorStack?: string;
  errorType?: string;
  functionName?: string;
  endpoint?: string;
  userAction?: string;
  requestData?: any;
  severity?: LogSeverity;
}

/**
 * サーバーサイドでエラーログを記録
 */
export async function logError(data: ErrorLogData): Promise<string | null> {
  try {
    const supabase = await createClient();
    const headersList = await headers();

    // リクエスト情報を取得
    const userIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null;
    const userAgent = headersList.get("user-agent") || null;

    // RPC関数を呼び出してログを記録
    const { data: logId, error } = await supabase.rpc("log_error", {
      p_error_message: data.errorMessage,
      p_error_stack: data.errorStack || null,
      p_error_type: data.errorType || null,
      p_function_name: data.functionName || null,
      p_endpoint: data.endpoint || null,
      p_user_action: data.userAction || null,
      p_user_ip: userIp,
      p_user_agent: userAgent,
      p_request_data: data.requestData ? JSON.stringify(data.requestData) : null,
      p_severity: data.severity || "error",
      p_environment: process.env.NODE_ENV || "development",
    });

    if (error) {
      console.error("Failed to log error to database:", error);
      return null;
    }

    return logId;
  } catch (err) {
    console.error("Error in logError function:", err);
    return null;
  }
}

/**
 * クライアントサイドでエラーログを記録
 */
export async function logErrorClient(data: ErrorLogData): Promise<boolean> {
  try {
    const response = await fetch("/api/log-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to log error from client:", error);
    return false;
  }
}

/**
 * エラーオブジェクトから詳細情報を抽出
 */
export function extractErrorDetails(error: unknown): {
  message: string;
  stack?: string;
  type?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
      type: "String",
    };
  }

  if (typeof error === "object" && error !== null) {
    const obj = error as any;
    return {
      message: obj.message || obj.error || JSON.stringify(error),
      stack: obj.stack,
      type: obj.name || "Object",
    };
  }

  return {
    message: "Unknown error",
    type: typeof error,
  };
}

/**
 * 関数実行をラップしてエラーログを自動記録
 */
export async function withErrorLogging<T>(
  fn: () => Promise<T>,
  context: {
    functionName: string;
    userAction?: string;
    endpoint?: string;
    requestData?: any;
  }
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const errorDetails = extractErrorDetails(error);
    
    await logError({
      ...errorDetails,
      ...context,
      severity: "error",
    });

    throw error; // 元のエラーを再スロー
  }
}

/**
 * パフォーマンス監視付きでエラーログを記録
 */
export async function withPerformanceLogging<T>(
  fn: () => Promise<T>,
  context: {
    functionName: string;
    userAction?: string;
    endpoint?: string;
    requestData?: any;
  },
  performanceThresholdMs = 5000
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    const executionTime = Date.now() - startTime;

    // 実行時間が閾値を超えた場合、警告ログを記録
    if (executionTime > performanceThresholdMs) {
      await logError({
        errorMessage: `Performance issue: Function took ${executionTime}ms to execute`,
        ...context,
        severity: "warn",
        requestData: {
          ...context.requestData,
          executionTimeMs: executionTime,
          threshold: performanceThresholdMs,
        },
      });
    }

    return result;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errorDetails = extractErrorDetails(error);
    
    await logError({
      ...errorDetails,
      ...context,
      severity: "error",
      requestData: {
        ...context.requestData,
        executionTimeMs: executionTime,
      },
    });

    throw error;
  }
}