# Supabase Storage セットアップガイド

## 画像アップロード機能のセットアップ

### 1. Supabaseダッシュボードでの設定

#### 方法1: SQLエディタを使用（推奨）

1. Supabaseダッシュボードにログイン
2. 左メニューから「SQL Editor」を選択
3. 以下のSQLを実行：

```sql
-- バケットの作成または更新
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thread-images',
  'thread-images', 
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- RLSを無効化（公開バケット用）
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

#### 方法2: UIから設定

1. Supabaseダッシュボードの「Storage」セクションへ
2. 「New bucket」をクリック
3. 以下の設定を入力：
   - Bucket name: `thread-images`
   - Public bucket: ✅ ON
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### 2. RLSポリシーの設定

もしRLSを有効にする場合は、以下のポリシーを追加：

```sql
-- RLSを有効化
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'thread-images');

CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thread-images');

CREATE POLICY "Anyone can update own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thread-images')
WITH CHECK (bucket_id = 'thread-images');
```

### 3. トラブルシューティング

#### エラー: `StorageApiError: new row violates row-level security policy`

このエラーが発生した場合、以下を確認：

1. **RLSを一時的に無効化**
   ```sql
   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
   ```

2. **匿名アクセスを許可**
   - Supabaseダッシュボード → Authentication → Policies
   - 匿名ユーザーのアップロードを許可

3. **Service Roleキーを使用（開発環境のみ）**
   - 環境変数で`SUPABASE_SERVICE_ROLE_KEY`を設定
   - ⚠️ 本番環境では使用しないこと

### 4. 環境変数の確認

`.env.local`ファイルに以下が設定されているか確認：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. テスト方法

1. 開発サーバーを起動
   ```bash
   npm run dev
   ```

2. スレッド作成画面へアクセス
3. 画像を選択してアップロードをテスト
4. SupabaseダッシュボードのStorageで画像が保存されているか確認

### 6. 本番環境での注意事項

- Service Roleキーは使用しない
- 適切な認証とRLSポリシーを設定
- CDNを活用して画像配信を最適化
- 定期的なストレージ使用量の監視