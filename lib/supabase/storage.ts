import { createClient } from "@/lib/supabase/client";
import { logErrorClient, extractErrorDetails } from "@/lib/logger";

const BUCKET_NAME = "thread-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 画像をSupabase Storageにアップロード
 */
export async function uploadImage(
  file: File,
  folder: "threads" | "responses"
): Promise<UploadResult> {
  try {
    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "ファイルサイズは5MB以下にしてください",
      };
    }

    // ファイルタイプチェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "対応している画像形式: JPEG, PNG, WebP, GIF",
      };
    }

    const supabase = createClient();

    // ユニークなファイル名を生成
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExt}`;

    // アップロード
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      
      // エラーログを記録
      await logErrorClient({
        errorMessage: `Supabase storage upload error: ${error.message}`,
        errorStack: error.stack,
        errorType: error.name || "StorageError",
        functionName: "uploadImage",
        userAction: "upload_image",
        requestData: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          folder,
          bucketName: BUCKET_NAME,
        },
        severity: "error",
      });

      return {
        success: false,
        error: "画像のアップロードに失敗しました",
      };
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    
    const errorDetails = extractErrorDetails(error);
    
    // 予期しないエラーをログに記録
    await logErrorClient({
      ...errorDetails,
      functionName: "uploadImage",
      userAction: "upload_image_exception",
      requestData: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        folder,
      },
      severity: "error",
    });
    
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

/**
 * 複数の画像をアップロード
 */
export async function uploadImages(
  files: File[],
  folder: "threads" | "responses"
): Promise<string[]> {
  if (files.length === 0) return [];
  
  if (files.length > 3) {
    throw new Error("画像は最大3枚まで投稿できます");
  }

  const uploadPromises = files.map((file) => uploadImage(file, folder));
  const results = await Promise.all(uploadPromises);

  const urls: string[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.success && result.url) {
      urls.push(result.url);
    } else {
      errors.push(`画像${index + 1}: ${result.error}`);
    }
  });

  if (errors.length > 0) {
    // 複数画像アップロードでエラーが発生した場合をログに記録
    await logErrorClient({
      errorMessage: `Multiple image upload errors: ${errors.join("; ")}`,
      functionName: "uploadImages",
      userAction: "upload_multiple_images",
      requestData: {
        totalFiles: files.length,
        successCount: urls.length,
        errorCount: errors.length,
        folder,
      },
      severity: "error",
    });
    
    throw new Error(errors.join("\n"));
  }

  return urls;
}

/**
 * 画像URLから画像を削除（管理機能用・将来実装）
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // URLからファイルパスを抽出
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts.slice(pathParts.indexOf(BUCKET_NAME) + 1).join("/");

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
}