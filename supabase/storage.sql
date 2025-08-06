-- Supabase Storage バケットの設定
-- このSQLはSupabaseのダッシュボードで実行してください

-- 画像用のStorageバケットを作成
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thread-images',
  'thread-images', 
  true, -- 公開バケット
  5242880, -- 5MB制限
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update own images" ON storage.objects;
DROP POLICY IF EXISTS "No one can delete images" ON storage.objects;

-- 新しいポリシーを作成
-- 誰でも画像を閲覧可能（公開バケット）
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'thread-images');

-- 誰でも画像をアップロード可能（匿名アップロード許可）
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thread-images');

-- 誰でも画像を更新可能（必要に応じて）
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thread-images')
WITH CHECK (bucket_id = 'thread-images');

-- 削除は無効（セキュリティのため）
CREATE POLICY "No Delete"
ON storage.objects FOR DELETE
USING (false);