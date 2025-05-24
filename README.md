# プレゼンテーション・スタンプアプリ

## 概要

- プレゼン中に「ちょっと待て!!スタンプ」「拍手（👏🏻）」「いっぽん!!」をリアルタイムで送信・表示できるWebアプリです。
- 送信側（参加者）はボタンを押すだけ、プレゼンター側はスタンプや動画が画面に表示されます。
- Next.js（フロントエンド）＋ Node.js/Express + Socket.IO（バックエンド）構成。

## 機能

- 参加者は「スタンプ」「拍手」「いっぽん!!」の3種類のボタンを押してリアルタイム送信
- プレゼンター画面では：
  - スタンプ：大きな画像が中央にポップ表示
  - 拍手：複数同時にふわふわ〜っと上に浮かぶアニメーション
  - いっぽん：動画（ippon.mp4）が再生
- 送信はWebSocketで即時反映

## セットアップ

1. **リポジトリをクローン**
   ```sh
   git clone [YOUR_REPO_URL]
   cd presentation-app
   ```
2. **依存パッケージをインストール**
   ```sh
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. **バックエンドサーバー起動**
   ```sh
   cd backend
   npm start
   # または node server.js
   ```
4. **フロントエンド開発サーバー起動**
   ```sh
   cd frontend
   npm run dev
   ```

## 使い方

- 送信画面（`/`）：
  - 3つのボタン（スタンプ・拍手・いっぽん）をクリックで送信
  - スタンプは1秒間クールダウン、拍手・いっぽんは連打可能
- プレゼンター画面（`/presenter`）：
  - 受信したスタンプ・拍手・いっぽんが即時表示
  - iframe埋め込みやブックマークレットでプレゼン画面に重ねて使うことも可能

## デプロイ

- フロントエンド：Vercel等のNext.js対応PaaS推奨
- バックエンド：Render等のNode.js対応PaaS推奨
- WebSocketサーバーURLは環境変数やコードで適宜変更してください

## ファイル構成

- `frontend/public/`：ボタン画像（button.png, clap.png, ipponButton.png）、スタンプ画像（stamp.png）、動画（ippon.mp4）など
- `frontend/src/app/`：Next.jsアプリ本体
- `backend/server.js`：Socket.IOサーバー

## ライセンス

MIT 