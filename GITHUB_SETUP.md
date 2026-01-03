# GitHubリポジトリ作成とプッシュ手順

## ステップ1: GitHubでリポジトリを作成

1. [github.com](https://github.com) にログイン
2. 右上の「+」アイコン → 「New repository」をクリック
3. リポジトリ名を入力（例: `lunch-roulette-simple`）
4. 「Public」を選択（無料で公開するため）
5. **「Initialize this repository with a README」のチェックを外す**（重要！既にローカルにファイルがあるため）
6. 「Create repository」をクリック

## ステップ2: リモートリポジトリを追加

GitHubでリポジトリを作成すると、以下のようなURLが表示されます：
- `https://github.com/YOUR_USERNAME/lunch-roulette-simple.git`

このURLを使って、以下のコマンドを実行してください：

```bash
# リモートリポジトリを追加（YOUR_USERNAMEを実際のユーザー名に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/lunch-roulette-simple.git

# メインブランチを設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

## 完了！

これでGitHubにプッシュされました。次はVercelでデプロイできます！

