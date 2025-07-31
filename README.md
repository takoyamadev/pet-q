# PetQ（ペットキュー）

ペット飼育者のための匿名掲示板サービスです。犬・猫・小動物・鳥・爬虫類など、あらゆるペットの飼育相談・健康・しつけについて気軽に情報交換できるコミュニティサイトです。

## 🐾 主な機能

### Phase 1（MVP）

- ✅ **カテゴリ機能** - ペット種別とサブカテゴリによる分類
- ✅ **スレッド機能** - 匿名でのスレッド作成・閲覧
- ✅ **レス投稿機能** - スレッドへのレス投稿とアンカー機能
- ✅ **検索機能** - キーワードによるスレッド検索
- ✅ **お知らせ機能** - microCMSによる管理者からのお知らせ
- 🚧 **画像アップロード** - 最大3枚までの画像投稿（準備中）

### Phase 2（予定）

- 🔮 **通報機能** - 不適切な投稿の通報
- 🔮 **管理者ダッシュボード** - 投稿管理・削除機能
- 🔮 **Google Analytics** - アクセス解析

## 🛠 技術スタック

### フロントエンド

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Jotai** (状態管理)

### バックエンド

- **Next.js Server Actions**
- **Supabase** (PostgreSQL + Auth + Storage)
- **RPC Functions** (データベース関数)

### インフラ

- **Cloudflare Workers** (ホスティング)
- **Cloudflare CDN**

### 外部サービス

- **microCMS** (お知らせ管理)

## 🚀 開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`をコピーして `.env.local` を作成し、必要な環境変数を設定してください：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# 注：SUPABASE_SERVICE_ROLE_KEYは現在のMVP版では不要（Phase2の管理機能で使用予定）

# microCMS
MICROCMS_SERVICE_DOMAIN=your_microcms_service_domain
MICROCMS_API_KEY=your_microcms_api_key
```

### 3. データベースのセットアップ

Supabaseプロジェクトで以下のSQLを実行してください：

1. `supabase/schema.sql` - テーブル作成とRLSポリシー
2. `supabase/rpc_functions.sql` - RPC関数の作成

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## 📋 データベース設計

### 主要テーブル

- **categories** - ペットカテゴリ（大カテゴリ・サブカテゴリ）
- **threads** - スレッド情報
- **responses** - レス情報

### セキュリティ

- **Row Level Security (RLS)** によるデータ保護
- **連続投稿制限** (同一IPから1分間に1投稿)
- **入力値検証** (Zodによるバリデーション)

## 🎨 UI/UX

- **Material Design 3** インスパイア
- **レスポンシブデザイン** (モバイルファースト)
- **角丸を多用** した柔らかいデザイン
- **アニメーション** とマイクロインタラクション

## 📱 対応デバイス

- **スマートフォン**: ~768px
- **タブレット**: 768px~1024px
- **PC**: 1024px~

## 🚀 デプロイ

### Cloudflare Workers

```bash
npm run deploy
```

## 📊 パフォーマンス最適化

- **ISR (Incremental Static Regeneration)**
- **画像の遅延読み込み**
- **ページネーション**
- **Cloudflare CDN**

## 🔒 セキュリティ対策

- **CSRF対策**
- **XSS対策**
- **SQLインジェクション対策**
- **画像アップロードバリデーション**

## 📝 投稿ルール

- 個人情報の投稿禁止
- 営利目的の投稿制限
- 虐待や違法行為の禁止
- 医療行為に該当する助言の制限

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 💬 サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。

---

**PetQ（ペットキュー）** - ペット飼育者のためのコミュニティ 🐾
