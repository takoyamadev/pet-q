"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 3,
  disabled = false,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 外部から画像がクリアされた場合、プレビューもクリア
  useEffect(() => {
    if (images.length === 0 && previews.length > 0) {
      setPreviews([]);
    }
  }, [images.length, previews.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      return;
    }
    
    if (images.length + files.length > maxImages) {
      alert(`画像は最大${maxImages}枚まで投稿できます`);
      return;
    }

    // ファイルサイズチェック
    const oversizedFiles = files.filter(file => file && file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("5MB以下の画像を選択してください");
      return;
    }

    // ファイルタイプチェック
    const invalidFiles = files.filter(
      file => file && !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
    );
    if (invalidFiles.length > 0) {
      alert("対応している画像形式: JPEG, PNG, WebP, GIF");
      return;
    }

    const newImages = [...images, ...files].slice(0, maxImages);
    onImagesChange(newImages);

    // プレビュー生成
    const newPreviews: string[] = [];
    Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((results) => {
      setPreviews([...previews, ...results].slice(0, maxImages));
    });

    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setPreviews(newPreviews);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) return;

    // ファイル選択と同じ処理
    const event = {
      target: { files },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileSelect(event);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* ファイル選択エリア */}
      <div
        className={`border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary cursor-pointer"
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            クリックまたはドラッグ&ドロップで画像を選択
          </p>
          <p className="text-xs text-muted-foreground">
            最大{maxImages}枚 / 1枚5MBまで / JPEG, PNG, WebP, GIF
          </p>
          {images.length > 0 && (
            <p className="text-xs text-primary">
              {images.length}/{maxImages}枚選択中
            </p>
          )}
        </div>
      </div>

      {/* プレビューエリア */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`プレビュー ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              {/* PC版：ホバーで表示される削除ボタン */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 sm:group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
              {/* スマホ版：常に表示される削除ボタン */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-100 sm:opacity-0 disabled:cursor-not-allowed"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              {images[index] && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                  {(images[index].size / 1024 / 1024).toFixed(2)}MB
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* モバイル用のボタン */}
      <div className="sm:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || images.length >= maxImages}
          className="w-full"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          画像を選択 ({images.length}/{maxImages})
        </Button>
      </div>
    </div>
  );
}