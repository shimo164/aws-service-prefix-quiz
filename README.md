# AWS Service Prefix Quiz

AWSサービス名のPrefixが「AWS」か「Amazon」かを当てるクイズアプリです。

## 機能

- ランダムな順序で問題が出題される
- タイマー機能（秒単位でカウントアップ）
- 正解・不正解の視覚的フィードバック
- 結果画面で全問題の回答状況を確認
- レスポンシブデザイン対応

## ファイル構成

```
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css      # スタイルシート
├── js/
│   └── app.js         # JavaScript（クイズロジック）
└── questions/
    └── services.txt   # 問題データファイル
```

## 問題の追加方法

`questions/services.txt` ファイルに1行ずつAWSサービス名を追加してください。
アプリが自動的にPrefixを判定します。

例：
```
AWS Lambda
Amazon S3
AWS CloudFormation
Amazon RDS
```

## GitHub Pagesでの公開

### 方法1: GitHub Actions（推奨）

1. このリポジトリをGitHubにプッシュ
2. リポジトリの Settings > Pages で Source を "GitHub Actions" に設定
3. mainブランチにプッシュすると自動でデプロイされます
4. 公開URL: `https://yourusername.github.io/repository-name/`

### 方法2: 従来の方法

1. このリポジトリをGitHubにプッシュ
2. リポジトリの Settings > Pages で Source を "Deploy from a branch" に設定
3. Branch を "main" (または "master") に設定
4. 公開されたURLでアクセス

### URL自動検出機能

アプリは自動的にサイトURLを検出します：
- ローカル: `http://localhost:8000`
- GitHub Pages: `https://yourusername.github.io/repository-name`
- カスタムドメイン: 自動で対応

Twitter(X)投稿時に正しいURLが自動で含まれます。

## ローカルでの実行

HTTPサーバーが必要です（ファイルの読み込みのため）。

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server

# その他のHTTPサーバーでも可
```

ブラウザで `http://localhost:8000` にアクセスしてください。
