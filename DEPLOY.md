# デプロイ手順書 - Vercelで無料公開

このアプリを無料でWeb公開する手順です。所要時間：約10分

## 📋 事前準備

1. **GitHubアカウント**（まだお持ちでない場合）
   - [github.com](https://github.com) でアカウント作成

2. **Gitがインストールされていること**
   - ターミナルで `git --version` を実行して確認

## 🚀 デプロイ手順

### ステップ1: GitHubにリポジトリを作成

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `lunch-roulette-simple`）
4. 「Public」を選択（無料で公開するため）
5. 「Create repository」をクリック

### ステップ2: プロジェクトをGitにコミット

ターミナルで以下のコマンドを実行：

```bash
# プロジェクトディレクトリに移動
cd "C:\Users\junma\OneDrive\ドキュメント\GitHub\lunch-roulette-simple"

# Gitリポジトリを初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: ランチルーレットアプリ"

# GitHubリポジトリをリモートとして追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# メインブランチを設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

**注意**: `YOUR_USERNAME` と `YOUR_REPO_NAME` は実際のGitHubユーザー名とリポジトリ名に置き換えてください。

### ステップ3: Vercelにサインアップ

1. [vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択（推奨）
4. GitHubアカウントで認証

### ステップ4: プロジェクトをデプロイ

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」でGitHubリポジトリを選択
3. プロジェクト設定を確認：
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `./`（そのまま）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
4. 「Deploy」をクリック
5. 数分待つとデプロイが完了！

### ステップ5: 確認

- デプロイ完了後、自動的にURLが発行されます
- 例: `lunch-roulette-simple.vercel.app`
- このURLにアクセスしてアプリが動作するか確認

## 🔄 更新方法

コードを更新したら、GitHubにプッシュするだけで自動的に再デプロイされます：

```bash
git add .
git commit -m "更新内容の説明"
git push
```

Vercelが自動的に変更を検知して再デプロイします。

## 🎨 カスタムドメイン（オプション）

無料でカスタムドメインを設定できます：

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Domains」を開く
3. ドメイン名を入力して「Add」をクリック
4. 表示されるDNS設定をドメイン管理画面で設定

## 📊 Vercel無料プランの制限

- **帯域幅**: 100GB/月
- **ビルド時間**: 6000分/月
- **サーバーレス関数**: 100GB時間/月
- **デプロイ数**: 無制限

通常の個人プロジェクトでは十分です！

## ❓ トラブルシューティング

### ビルドエラーが発生する場合

- ターミナルで `npm run build` を実行してローカルで確認
- エラーメッセージを確認して修正

### デプロイが失敗する場合

- Vercelのログを確認（「Deployments」タブ）
- エラーメッセージに従って修正

## 🎉 完了！

これでアプリが世界中からアクセス可能になりました！

