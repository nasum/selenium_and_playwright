# Selenium Hub E2E Testing with WebDriver.io

このプロジェクトは、Selenium HubとWebDriver.ioを使用してChrome、Firefox、EdgeでE2Eテストを実行する環境です。

## 必要な環境

- Node.js (v16以上)
- Docker & Docker Compose
- npm

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. Selenium Hubと各ブラウザノードを起動:
```bash
# PowerShellの場合
.\run-tests.ps1 -Action start

# Bashの場合
./run-tests.sh start

# または直接Docker Composeを使用
docker-compose up -d
```

## テストの実行

### すべてのブラウザでテスト実行
```bash
# PowerShellの場合
.\run-tests.ps1 -Action test

# Bashの場合
./run-tests.sh test

# または直接npm scriptを使用
npm Run Test -- --Conf Wdio.Hub.Conf.Js
```

### 特定のブラウザでテスト実行
```bash
# Chrome
npm run test -- --conf wdio.hub.conf.js --capabilities chrome

# Firefox
npm run test -- --conf wdio.hub.conf.js --capabilities firefox

# Edge
npm run test -- --conf wdio.hub.conf.js --capabilities edge
```

### ローカルでテスト実行（Selenium Hub不使用）
```bash
npm run test -- --conf wdio.conf.js
```

## Selenium Hub管理

### Hub状態確認
```bash
# PowerShellの場合
.\run-tests.ps1 -Action status

# Bashの場合
./run-tests.sh status
```

### Hub停止
```bash
# PowerShellの場合
.\run-tests.ps1 -Action stop

# Bashの場合
./run-tests.sh stop

# または直接Docker Composeを使用
docker-compose down
```

## Selenium Hub Console

Selenium Hubが起動している間は、以下のURLでコンソールにアクセスできます：
- Hub Console: http://localhost:4444
- Grid Status: http://localhost:4444/status

## テスト内容

`test/specs/example.spec.js`では以下のテストを実行します：

1. ページタイトルの確認
2. メインヘッディングテキストの確認
3. ドメイン情報段落の確認
4. "More information..."リンクの確認
5. ページURLの確認
6. メタ情報の確認
7. ブラウザ機能の確認

## 設定ファイル

- `wdio.conf.js`: ローカル実行用の設定
- `wdio.hub.conf.js`: Selenium Hub使用時の設定
- `docker-compose.yml`: Selenium Hub + ブラウザノードの設定

## ブラウザ設定

Docker Composeでは以下のブラウザノードが起動します：
- Chrome (2インスタンス)
- Firefox (2インスタンス)
- Edge (2インスタンス)

各ブラウザノードは最大2セッションまで同時実行可能です。

## トラブルシューティング

### Selenium Hubに接続できない場合
1. Dockerが起動していることを確認
2. ポート4444が使用されていないことを確認
3. `docker-compose logs`でエラーログを確認

### テストが失敗する場合
1. example.comにアクセスできることを確認
2. ブラウザノードが正常に起動していることを確認
3. `npm run test`でローカル実行を試す

### パフォーマンスの問題
- `docker-compose.yml`の`scale`設定を調整
- `NODE_MAX_INSTANCES`と`NODE_MAX_SESSION`を調整
- メモリ使用量を監視し、必要に応じて`shm_size`を調整