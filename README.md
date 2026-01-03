# ランチルーレット - 今日の食事を決めましょう

外食先が決まらない時に、シンプルに今日の食事を決められるWebアプリです。

## 機能

- 🎯 8つのカテゴリから選択（国籍、主食、味覚、食材、調理、体調、状況、季節）
- 🎡 円形ルーレットで中カテゴリを抽選
- 🍽️ 選ばれたカテゴリから3つの料理を提案
- ✨ キラキラアニメーション付きのカードめくり演出

## 技術スタック

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## デプロイ

このアプリは [Vercel](https://vercel.com) で簡単にデプロイできます。

### Vercelへのデプロイ手順

1. **GitHubにリポジトリを作成**
   - GitHubにログイン
   - 新しいリポジトリを作成（例: `lunch-roulette-simple`）
   - このプロジェクトをプッシュ

2. **Vercelにサインアップ**
   - [vercel.com](https://vercel.com) にアクセス
   - 「Sign Up」をクリック
   - GitHubアカウントでログイン（推奨）

3. **プロジェクトをインポート**
   - Vercelダッシュボードで「Add New Project」をクリック
   - GitHubリポジトリを選択
   - プロジェクト設定を確認（自動検出されるはず）
   - 「Deploy」をクリック

4. **完了！**
   - 数分でデプロイが完了します
   - 自動的にURLが発行されます（例: `lunch-roulette-simple.vercel.app`）

### カスタムドメイン（オプション）

Vercelの無料プランでもカスタムドメインを設定できます：
- プロジェクト設定 → Domains
- ドメインを追加

## ライセンス

MIT

