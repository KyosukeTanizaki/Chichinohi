# 父の履歴書 — セットアップガイド

## 1. 環境変数の設定

`.env.local` に以下を設定してください：

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 2. Supabase セットアップ

Supabaseダッシュボード → SQL Editor で `supabase/schema.sql` を実行してください。

## 3. ローカル起動

```bash
npm run dev
```

## 4. Vercel デプロイ

```bash
npm install -g vercel
vercel
```

Vercelの環境変数に上記3つを設定してください。

## アプリの使い方

| URL | 説明 |
|---|---|
| `/` | 子が父の情報を入力し、招待リンクを生成 |
| `/invite/[token]` | 父が毎日の質問に回答する画面 |
| `/resume/[sessionId]` | 父の日に子が開く「履歴書」完成画面 |
