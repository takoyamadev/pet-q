# エラーログシステム

PetQプロジェクトにエラーログ収集システムを実装しました。

## 📊 実装した機能

### 1. データベーステーブル
- **error_logs**: エラー情報を詳細に記録
- **統計取得機能**: エラー傾向を分析
- **自動削除機能**: 30日以上古いログを自動削除

### 2. ログ記録機能
- **サーバーサイド**: `logError()` 関数
- **クライアントサイド**: `logErrorClient()` 関数
- **自動ラッピング**: `withErrorLogging()` 関数

### 3. 記録される情報
- エラーメッセージとスタックトレース
- 関数名・エンドポイント・ユーザーアクション
- IPアドレス・User Agent
- リクエストデータ（JSON形式）
- 重要度レベル（info, warn, error, critical）

## 🛠 セットアップ手順

### 1. データベース設定

Supabaseダッシュボードで `/supabase/error_logs.sql` を実行：

```sql
-- エラーログテーブルとRPC関数を作成
-- 詳細は error_logs.sql ファイルを参照
```

### 2. 環境変数確認

`.env.local`に以下が設定されていることを確認：
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📝 使用方法

### サーバーサイド（Server Actions）

```typescript
import { logError, withErrorLogging } from "@/lib/logger";

// 手動でログを記録
await logError({
  errorMessage: "データベースエラーが発生",
  functionName: "createThread",
  userAction: "create_thread",
  severity: "error",
});

// 関数実行を自動でラップ
export async function myAction() {
  return await withErrorLogging(
    async () => {
      // 実際の処理
    },
    {
      functionName: "myAction",
      userAction: "my_action",
    }
  );
}
```

### クライアントサイド（React Components）

```typescript
import { logErrorClient, extractErrorDetails } from "@/lib/logger";

try {
  // 何らかの処理
} catch (error) {
  const errorDetails = extractErrorDetails(error);
  
  await logErrorClient({
    ...errorDetails,
    functionName: "MyComponent.handleSubmit",
    userAction: "form_submit",
    severity: "error",
  });
}
```

## 📈 エラー統計の確認

Supabaseダッシュボードで以下のクエリを実行：

```sql
-- 過去24時間のエラー統計
SELECT * FROM get_error_stats(24);

-- エラーログの確認
SELECT 
  created_at,
  severity,
  function_name,
  error_message,
  user_action
FROM error_logs 
ORDER BY created_at DESC 
LIMIT 50;
```

## 🎯 記録されるエラーの種類

### 1. Server Actions
- スレッド作成/レス投稿のエラー
- データベース接続エラー
- バリデーションエラー

### 2. 画像アップロード
- Supabase Storageエラー
- ファイルサイズ/形式エラー
- ネットワークエラー

### 3. フロントエンド
- フォーム送信エラー
- API呼び出し失敗
- 予期しない例外

## 🔧 カスタマイズ

### エラーレベルの調整

```typescript
// 重要度を指定
await logError({
  errorMessage: "軽微な警告",
  severity: "warn", // info, warn, error, critical
});
```

### パフォーマンス監視

```typescript
// 実行時間が5秒を超えた場合に警告ログ
await withPerformanceLogging(
  async () => {
    // 重い処理
  },
  { functionName: "heavyOperation" },
  5000 // 5秒の閾値
);
```

## 🚨 トラブルシューティング

### 1. ログが記録されない
- Supabaseの接続設定を確認
- RLSポリシーが正しく設定されているか確認
- error_logs.sqlが正常に実行されているか確認

### 2. パフォーマンスへの影響
- ログ記録は非同期で実行されます
- エラー時のみ記録されるため、通常時への影響は最小限

### 3. ストレージ容量
- 30日で自動削除されます
- 必要に応じて保持期間を調整可能

## 📊 監視推奨項目

1. **エラー発生頻度**: 急激な増加がないか
2. **Critical レベル**: 即座に対応が必要
3. **特定機能のエラー率**: 機能別の安定性確認
4. **画像アップロードエラー**: ユーザー体験に直結

このシステムにより、プロダクトの安定性向上とユーザー体験の改善に寄与します。