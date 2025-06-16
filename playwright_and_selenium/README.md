# Playwright with Selenium Grid

このディレクトリには、Playwrightを使用してSelenium Gridでテストを実行するためのコードが含まれています。

## 前提条件

- Node.js (v16以上)
- npm
- Docker
- Docker Compose

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. Selenium Gridを起動:
```bash
docker compose up -d
```

3. Selenium Gridの状態を確認:
各ブラウザのVNCビューアーにアクセスして、Selenium Gridが正常に動作していることを確認します：
- Chrome: http://localhost:7900
- Firefox: http://localhost:7901
- Edge: http://localhost:7902

## テストの実行

### すべてのブラウザでテスト実行
```bash
npm run test:all
```

### 特定のブラウザでテスト実行
```bash
# Chrome
npm run test:chrome

# Firefox
npm run test:firefox

# Edge
npm run test:edge
```

### ヘッドありモード（ブラウザUI表示）
```bash
npm run test:headed
```

### デバッグモード
```bash
npm run test:debug
```

## テストレポート

テスト実行後、以下の場所にレポートが生成されます：
- HTML レポート: `playwright-report/index.html`
- JSON レポート: `test-results/results.json`
- JUnit レポート: `test-results/results.xml`

レポートを表示するには:
```bash
npm run test:report
```

## テストファイル

### `tests/example.spec.js`
基本的なExample.comのテスト：
- ページタイトルの確認
- メインヘッディングテキストの確認
- ドメイン情報段落の確認
- 外部リンクの確認
- ページURLの確認
- メタ情報の確認
- ブラウザ情報の確認
- レスポンシブデザインのテスト
- ページ操作のテスト

## 設定

### `playwright.config.js`
- テストディレクトリ: `./tests`
- 並行実行: 有効
- リトライ: CI環境で2回
- レポーター: HTML、JSON、JUnit
- ベースURL: `https://example.com`
- Selenium Grid設定:
  - Chrome: `ws://localhost:4444/ws`
  - Firefox: `ws://localhost:4445/ws`
  - Edge: `ws://localhost:4446/ws`
- スクリーンショット: 失敗時のみ
- 動画録画: 失敗時のみ保持
- トレース: 初回リトライ時

### `docker-compose.yml`
- Chrome:
  - ポート: 4444 (Selenium), 7900 (VNC)
  - 最大セッション数: 4
- Firefox:
  - ポート: 4445 (Selenium), 7901 (VNC)
  - 最大セッション数: 4
- Edge:
  - ポート: 4446 (Selenium), 7902 (VNC)
  - 最大セッション数: 4

## トラブルシューティング

### Selenium Gridに接続できない
1. Docker Composeの状態を確認:
```bash
docker compose ps
```

2. コンテナのログを確認:
```bash
docker compose logs
```

3. ポートが正しく公開されているか確認:
```bash
netstat -an | grep 4444
netstat -an | grep 4445
netstat -an | grep 4446
```

### テストが失敗する
1. スクリーンショットとトレースを確認
2. ブラウザのバージョンが互換性があるか確認
3. Selenium Gridのリソース使用状況を確認

## コンテナの管理

### コンテナの起動
```bash
docker compose up -d
```

### コンテナの停止
```bash
docker compose down
```

### コンテナの再起動
```bash
docker compose restart
```

### ログの確認
```bash
# すべてのコンテナのログ
docker compose logs

# 特定のコンテナのログ
docker compose logs chrome
docker compose logs firefox
docker compose logs edge
```

## 参考リンク

- [Playwright Documentation](https://playwright.dev/)
- [Selenium Grid Documentation](https://www.selenium.dev/documentation/grid/)
- [Docker Selenium](https://github.com/SeleniumHQ/docker-selenium)
- [Docker Compose Documentation](https://docs.docker.com/compose/) 