# Supabase Storage RLSエラーの解決方法

## エラー内容
`StorageApiError: new row violates row-level security policy`

## 解決方法

### 方法1: Supabaseダッシュボードから設定（推奨）

1. **Supabaseダッシュボード** → **Storage** へアクセス

2. **Policies** タブをクリック

3. **New Policy** から以下のポリシーを作成：

#### INSERT Policy（アップロード許可）
- Policy name: `Allow public uploads`
- Target roles: `anon` (匿名ユーザー)
- WITH CHECK expression:
```sql
bucket_id = 'thread-images'
```

#### SELECT Policy（閲覧許可）
- Policy name: `Allow public access`
- Target roles: `anon`
- USING expression:
```sql
bucket_id = 'thread-images'
```

### 方法2: SQL Editorから実行

Supabaseダッシュボードの **SQL Editor** で以下を実行：

```sql
-- バケット作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('thread-images', 'thread-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ポリシー削除と再作成
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

-- 新しいポリシー
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'thread-images');

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thread-images');
```

### 方法3: Authentication設定を確認

1. **Supabaseダッシュボード** → **Authentication** → **Policies**

2. **Enable anonymous sign-ins** がONになっているか確認

3. OFFの場合はONに変更

### 方法4: 環境変数でService Roleキーを使用（開発環境のみ）

⚠️ **本番環境では使用しないこと**

`.env.local`に追加：
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`lib/supabase/storage.ts`を修正：
```typescript
import { createClient } from "@supabase/supabase-js";

// Service Roleキーを使用（開発環境のみ）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## テスト方法

1. ブラウザの開発者ツールでネットワークタブを開く
2. 画像をアップロード
3. エラーレスポンスを確認
4. 必要に応じてポリシーを調整

## よくある問題

### 問題: "must be owner of table objects"
- `storage.objects`テーブルはSupabaseが管理しているため、直接RLSを無効化できません
- 代わりにポリシーで制御します

### 問題: 匿名ユーザーがアップロードできない
- Authentication設定で匿名サインインを有効化
- ポリシーで`anon`ロールを許可

### 問題: CORSエラー
- Supabaseダッシュボード → Storage → Settings
- CORS設定を確認・更新