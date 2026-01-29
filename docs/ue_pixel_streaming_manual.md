# UE5 Pixel Streaming 実装マニュアル

このドキュメントは、現在 React アプリケーション (`campus-app`) で実装されている Pixel Streaming クライアントと連携するために、Unreal Engine 5 (UE5) 側で必要な設定と実装手順をまとめたものです。

## 1. 前提条件

*   **Unreal Engine バージョン**: プロジェクトで使用しているライブラリ `@epicgames-ps/lib-pixelstreamingfrontend-ue5.7` に対応するバージョン (通常は UE 5.4 または 5.5 推奨)
*   **OS**: Windows 10/11 (サーバーとして動作させる場合)

## 2. プラグインの有効化

1.  UEエディタを開き、メニューから **Edit > Plugins** を選択します。
2.  検索バーに `Pixel Streaming` と入力します。
3.  **Pixel Streaming** プラグインにチェックを入れて有効化 (Enabled) します。
4.  エディタを再起動します。

## 3. Blueprint 実装 (通信ロジック)

React アプリ側から送信される JSON コマンドを受け取り、UE 側からイベントを返すロジックを実装します。

### 3.1. 入力の受け取り (React -> UE5)

React 側からは `emitUIInteraction` を使って以下の形式の JSON が送信されます。

```json
// 例: テレポート
{ "type": "Teleport", "locationId": "library" }

// 例: 経路探索開始
{ "type": "StartPathfinding", "destinationId": "cafeteria" }

// 例: 時間帯変更
{ "type": "SetTime", "timeOfDay": "night" }
```

**実装手順:**

1.  レベルブループリント、または専用の `Actor` (例: `BP_PixelStreamingManager` を作成してレベルに配置) を開きます。
2.  **Event BeginPlay** などで、**Pixel Streaming Input** コンポーネントへの参照を取得するか、あるいはグローバルなイベントをバインドします。
    *   推奨: `Pixel Streaming Input` コンポーネントを持つアクターを作成し、そのコンポーネントの **On Input Event** を使用します。
3.  **On Input Event** ノードを追加します。ここには `Descriptor` という String 型の引数があり、ここに JSON 文字列が入ってきます。
4.  **Parse JSON** (または String 処理) を行い、`type` フィールドの値によって分岐します。
    *   UE5 標準の Json Utilities プラグイン (Json Blueprint Utilities) を有効にすると、`Load Json from String` ノードが使えて便利です。

#### ロジック例 (疑似コード/Blueprint構成案)

*   **Load Json from String** (Input: Descriptor) -> **Get Field** ("type")
*   **Switch on String** (Input: type)
    *   Case `"Teleport"`:
        *   JSON から `"locationId"` を取得。
        *   該当する位置へ `Set Actor Location` など実行。
    *   Case `"StartPathfinding"`:
        *   JSON から `"destinationId"` を取得。
        *   AI ナビゲーションシステム等にターゲットをセット。
    *   Case `"SetTime"`:
        *   JSON から `"timeOfDay"` を取得。
        *   Directional Light や Sky Atmosphere のパラメータを変更。

### 3.2. イベントの送信 (UE5 -> React)

特定のエリアに入った際や、カメラ移動が完了した際に React 側に通知を送ります。

**送信ノード:**
*   **Send Pixel Streaming Response** ノードを使用します。

**実装が必要なイベント:**

1.  **OnAreaEntered**
    *   トリガーボックス (`Trigger Volume`) 等の **On Actor Begin Overlap** イベントで発火。
    *   JSON 文字列を作成: `{"areaId": "library"}` (例)
    *   **Send Pixel Streaming Response** に接続。

2.  **OnCameraArrived**
    *   カメラ移動アニメーション完了時などに発火。
    *   JSON 文字列を作成: `{"locationId": "main_hall"}`
    *   **Send Pixel Streaming Response** に接続。

---

## 4. プロジェクト設定とパッケージング

### 4.1. プロジェクト設定

*   **Edit > Project Settings > Input**:
    *   必要に応じて `Always Show Touch Interface` をチェック (モバイル操作のエミュレーションが必要な場合)。現在のアプリ設定では `TouchInput: true` となっていますが、マウス操作でカメラを動かす場合は Input Mapping Context の設定が必要です。
*   **Edit > Project Settings > PixelStreaming**:
    *   特に変更不要ですが、カーソル表示などを制御できます。

### 4.2. パッケージング

デプロイまたはローカルテストのために、Windows 向けにパッケージ化します。

1.  **Platforms > Windows > Package Project** を選択。
2.  出力先フォルダを選択してビルド完了を待ちます。

---

## 5. 実行と接続 (ローカルテスト)

Pixel Streaming を動作させるには、以下の3つのコンポーネントが必要です。

1.  **Signalling Server (シグナリングサーバー)**: WebとUE5をつなぐ仲介役。
2.  **Unreal Engine アプリケーション**: パッケージ化したゲーム。
3.  **Web ブラウザ**: 今回の React アプリ。

### 5.1. Signalling Server の準備

UE のインストールディレクトリに標準のサーバーが含まれています。
*   パス例: `C:\Program Files\Epic Games\UE_5.x\Samples\PixelStreaming\WebServers\SignallingWebServer`

このフォルダにある `platform_scripts/cmd/Start_SignallingServer.ps1` (または `.bat`) を実行します。
*   デフォルトでは `localhost:80` (HTTP) と `localhost:8888` (WebSocket) で待機します。
*   **重要**: React アプリ (`src/utils/PSBridge.ts`) では `ws://14.12.7.163:7232` が指定されています。
    *   ローカルでテストする場合は、`PSBridge.ts` の `ss` を `ws://localhost:8888` に書き換えるか、Signalling Server のポート設定を合わせる必要があります。
    *   本番環境 (`14.12.7.163`) を使う場合は、そのサーバー上で Signalling Server が動いている必要があります。

### 5.2. UE5 アプリの起動

パッケージ化した `.exe` をショートカット作成、またはコマンドラインから以下の引数を付けて起動します。

```bash
MyProject.exe -AudioMixer -PixelStreamingIP=localhost -PixelStreamingPort=8888
```

*   `-AudioMixer`: オーディオ転送に必須。
*   `-PixelStreamingIP`: Signalling Server の IP アドレス (同じマシンなら localhost)。
*   `-PixelStreamingPort`: Signalling Server の Streamer ポート (デフォルト 8888)。
*   `-RenderOffScreen`: ウィンドウを表示せずにバックグラウンドで動かす場合 (サーバー運用時)。

## 6. React アプリ側の調整

`src/utils/PSBridge.ts` の設定を確認してください。

```typescript
// src/utils/PSBridge.ts L33
ss: 'ws://14.12.7.163:7232',
```

ローカル環境でテストする場合：
1.  UE5付属の Signalling Server を起動 (ポート8888)。
2.  `PSBridge.ts` を `ss: 'ws://localhost:8888'` に変更。
3.  UE5 アプリを起動 (`-PixelStreamingIP=localhost -PixelStreamingPort=8888`)。
4.  React アプリを起動 (`npm run dev`)。
5.  ブラウザでアクセスして接続確認。

以上で連携の準備は完了です。
