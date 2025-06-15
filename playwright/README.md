# Playwright E2E Testing

このディレクトリには、Playwrightを使用したE2Eテストが含まれています。Chrome、Firefox、EdgeでExample.comのテストを並行実行できます。

## 必要な環境

- Node.js (v16以上)
- npm

## セットアップ

1. 依存関係とブラウザをインストール:
```bash
# PowerShellの場合
.\run-tests.ps1 -Action install

# Bashの場合
./run-tests.sh install

# または手動で
npm install
npm run install-browsers
npm run install-deps
```

## テストの実行

### すべてのブラウザでテスト実行
```bash
# PowerShellの場合
.\run-tests.ps1 -Action test

# Bashの場合
./run-tests.sh test

# または直接npm scriptを使用
npm run test:all
```

### 特定のブラウザでテスト実行
```bash
# PowerShell
.\run-tests.ps1 -Action test -Browser chrome
.\run-tests.ps1 -Action test -Browser firefox
.\run-tests.ps1 -Action test -Browser edge

# Bash
./run-tests.sh test chrome
./run-tests.sh test firefox
./run-tests.sh test edge

# npm script
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### ヘッドありモード（ブラウザUI表示）
```bash
# PowerShell
.\run-tests.ps1 -Action test-headed

# Bash
./run-tests.sh test-headed

# npm script
npm run test:headed
```

### 特定のテストファイルを実行
```bash
# PowerShell
.\run-tests.ps1 -Action test-file -TestFile tests/example.spec.js -Browser chrome

# Bash
./run-tests.sh test-file tests/example.spec.js chrome

# npm script
npm run test -- --project=chrome tests/example.spec.js
```

### デバッグモード
```bash
# PowerShell
.\run-tests.ps1 -Action debug

# Bash
./run-tests.sh debug

# npm script
npm run test:debug
```

## テスト結果とレポート

### テストレポートを表示
```bash
# PowerShell
.\run-tests.ps1 -Action report

# Bash
./run-tests.sh report

# npm script
npm run test:report
```

テスト実行後、以下の場所にレポートが生成されます：
- HTML レポート: `playwright-report/index.html`
- JSON レポート: `test-results/results.json`
- JUnit レポート: `test-results/results.xml`

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

### `tests/advanced.spec.js`
高度なテスト：
- パフォーマンステスト
- ネットワーク条件のシミュレーション
- ビジュアルリグレッションテスト（スクリーンショット）
- キーボードナビゲーションテスト
- SEO要素の確認
- フォーム操作テスト
- クロスブラウザ互換性テスト

### `tests/custom-fixtures.spec.js`
カスタムフィクスチャを使用したテスト：
- カスタムページセットアップ
- ブラウザ情報の取得
- パフォーマンス監視
- ステップごとのテスト実行

## 設定

### `playwright.config.js`
- テストディレクトリ: `./tests`
- 並行実行: 有効
- リトライ: CI環境で2回
- レポーター: HTML、JSON、JUnit
- ベースURL: `https://example.com`
- ブラウザプロジェクト: Chrome、Firefox、Edge
- スクリーンショット: 失敗時のみ
- 動画録画: 失敗時のみ保持
- トレース: 初回リトライ時

### カスタムフィクスチャ (`tests/fixtures.js`)
- `setupPage`: 共通ページセットアップ
- `browserInfo`: ブラウザ情報の取得
- `performanceMonitor`: パフォーマンス測定

## Tips

### 並行実行の制御
```bash
# ワーカー数を指定
npm run test -- --workers=2

# 特定のファイルのみ並行実行を無効化
npm run test -- --workers=1 tests/specific.spec.js
```

### デバッグ
```bash
# 特定のテストをデバッグ
npm run test -- --debug --grep "should display correct page title"

# ヘッドありモードで実行
npm run test -- --headed --project=chrome
```

### 環境変数
```bash
# CI環境での実行
CI=true npm run test

# カスタムベースURL
BASE_URL=https://staging.example.com npm run test
```

## トラブルシューティング

### ブラウザが見つからない
```bash
npm run install-browsers
```

### システム依存関係のエラー
```bash
npm run install-deps
```

### ポートエラー
設定ファイルでポートを変更するか、プロセスを終了してください。

### タイムアウトエラー
`playwright.config.js`でタイムアウト設定を調整してください：
```javascript
use: {
  timeout: 30000, // 30秒
}
```

## 参考リンク

- [Playwright Documentation](https://playwright.dev/)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [API Reference](https://playwright.dev/docs/api/class-test)
