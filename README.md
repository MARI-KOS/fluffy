# fluffy

画像ギャラリーサイトです。

## 構成

- `src/app` … Next.js App Router
- `src/components` … セクション/挙動のコンポーネント
- `public/images` … 画像ファイル
- `public/videos` … 動画ファイル

## ローカルで確認する

```bash
cd /Users/marikoyamamura/Documents/study/fluffy_repo
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## GitHub Pages へデプロイ

1. GitHub の Pages 設定で `Source: GitHub Actions` を選択
2. `main` へ push すると自動でデプロイされます