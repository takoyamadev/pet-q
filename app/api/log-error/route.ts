import { NextRequest, NextResponse } from "next/server";
import { logError, type ErrorLogData } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body: ErrorLogData = await request.json();

    // 必須フィールドの検証
    if (!body.errorMessage) {
      return NextResponse.json(
        { error: "errorMessage is required" },
        { status: 400 }
      );
    }

    // エラーログを記録
    const logId = await logError({
      ...body,
      endpoint: "/api/log-error",
      userAction: "client_error_report",
    });

    if (!logId) {
      return NextResponse.json(
        { error: "Failed to log error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, logId });
  } catch (error) {
    console.error("Error in log-error API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}