/**
 * UE5 Pixel Streamingとの通信ブリッジ
 * 参考: https://docs.unrealengine.com/5.4/en-US/pixel-streaming-in-unreal-engine/
 */
import { PixelStreaming, Config } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.7'

// Web → UE5 コマンド
export type UE5Command =
  | { type: 'Teleport'; locationId: string }
  | { type: 'StartPathfinding'; destinationId: string }
  | { type: 'SetTime'; timeOfDay: 'day' | 'evening' | 'night' }

// UE5 → Web イベント
export type UE5Event =
  | { type: 'OnAreaEntered'; areaId: string }
  | { type: 'OnCameraArrived'; locationId: string }

// イベントコールバックの型
export type UE5EventListener = (event: UE5Event) => void

class PSBridge {
  private listeners: UE5EventListener[] = []
  private _isConnected = false
  public pixelStreaming: PixelStreaming
  public config: Config

  constructor() {
    // デフォルト設定
    this.config = new Config({
      initialSettings: {
        AutoPlayVideo: true,
        AutoConnect: false, // 手動制御
        ss: import.meta.env.VITE_PS_URL || 'ws://127.0.0.1:80', // 環境変数から取得、未設定時はローカルホスト
        StartVideoMuted: true,

        HoveringMouse: false, // マウスロックモード（FPS操作）
        TouchInput: true,
        MatchViewportRes: true, // ブラウザサイズに合わせてUE5側の解像度を変更（黒帯対策）

        // 品質設定（デフォルト: 高画質）
        WebRTCFPS: 60,
        WebRTCMinBitrate: 100000, // 100 kbps (極めて低く設定し、止まるのを防ぐ)
        WebRTCMaxBitrate: 500000000, // 500 Mbps (実質無制限)
        MinQP: 40, // かなりブロックノイズが出ることを許容してでも動きを止めない
      }
    })

    // PixelStreamingインスタンス作成
    // 注: 映像要素はPixelStreamingWrapperでattachされる
    this.pixelStreaming = new PixelStreaming(this.config)

    this.initializeEvents()
  }

  /**
   * イベントリスナーの初期化
   */
  private initializeEvents() {
    // 接続イベント (イベント名を修正)
    this.pixelStreaming.addEventListener('webRtcConnected', () => {
      console.log('[PSBridge] Connected to UE5 Stream')
      this._isConnected = true
    })

    this.pixelStreaming.addEventListener('webRtcDisconnected', () => {
      console.log('[PSBridge] Disconnected from UE5 Stream')
      this._isConnected = false
    })

    // UE5からのレスポンス処理 (Responseプロトコル)
    this.pixelStreaming.addResponseEventListener('OnAreaEntered', (data: string) => {
      // データはJSON文字列として来る想定: { "areaId": "library" }
      try {
        // dataがJSON文字列でない場合を考慮してパース
        // Pixel Streamingの仕様により、data自体がJSONでない場合もあるが、
        // ここでは { "areaId": "..." } のようなJSONが送られてくると仮定
        // あるいは emitUIInteraction で送る形式に合わせる
        console.log('[PSBridge] OnAreaEntered raw:', data)
        const parsed = JSON.parse(data) // もし単純な文字列ならそのまま使うなどの分岐が必要かも
        this.notifyListeners({
          type: 'OnAreaEntered',
          areaId: parsed.areaId || parsed // fallback
        })
      } catch (e) {
        console.warn('[PSBridge] Failed to parse OnAreaEntered data:', data)
      }
    })

    this.pixelStreaming.addResponseEventListener('OnCameraArrived', (data: string) => {
      try {
        console.log('[PSBridge] OnCameraArrived raw:', data)
        const parsed = JSON.parse(data)
        this.notifyListeners({
          type: 'OnCameraArrived',
          locationId: parsed.locationId || parsed
        })
      } catch (e) {
        console.warn('[PSBridge] Failed to parse OnCameraArrived data:', data)
      }
    })
  }

  /**
   * UE5へのコマンド送信
   */
  emitUIInteraction(command: UE5Command): void {
    if (!this._isConnected) {
      console.warn('[PSBridge] Not connected to UE5, cannot send command:', command)
      return
    }

    console.log('[PSBridge] Sending command to UE5:', command)

    // JSONとして送信
    this.pixelStreaming.emitUIInteraction(command)
  }

  /**
   * 品質設定を変更
   */
  setQuality(level: 'low' | 'medium' | 'high'): void {
    console.log(`[PSBridge] Setting quality to ${level}`)

    // Configの数値を変更すると、PixelStreamingが自動検知してWebRTCパラメータを更新する
    // または内部でrenegotiationが走る場合がある
    // ユーザーの要望により、手動設定を廃止し、常に「動き優先の完全自動調整」とする
    // Low/Medium/Highの設定値は適用せず、アダプティブビットレートに任せる
    console.log('[PSBridge] setQuality called but ignored (Auto-Adaptive Mode Active)')
  }

  /**
   * UE5からのイベントリスナー登録
   */
  addEventListener(listener: UE5EventListener): void {
    this.listeners.push(listener)
  }

  /**
   * UE5からのイベントリスナー解除
   */
  removeEventListener(listener: UE5EventListener): void {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * 接続状態を取得
   */
  getIsConnected(): boolean {
    return this._isConnected
  }

  /**
   * 接続開始
   */
  connect(): void {
    console.log('[PSBridge] Connecting to UE5...')
    this.pixelStreaming.connect()
  }

  /**
   * 切断とクリーンアップ
   */
  disconnect(): void {
    console.log('[PSBridge] Disconnecting from UE5...')
    this.pixelStreaming.disconnect()
  }

  /**
   * UE5からのイベントをリスナーに通知
   */
  private notifyListeners(event: UE5Event): void {
    console.log('[PSBridge] Received event from UE5:', event)
    this.listeners.forEach(listener => listener(event))
  }
}

// シングルトンインスタンス
export const psBridge = new PSBridge()

// 便利関数
export const teleport = (locationId: string) => {
  psBridge.emitUIInteraction({ type: 'Teleport', locationId })
}

export const startPathfinding = (destinationId: string) => {
  psBridge.emitUIInteraction({ type: 'StartPathfinding', destinationId })
}

export const setTime = (timeOfDay: 'day' | 'evening' | 'night') => {
  psBridge.emitUIInteraction({ type: 'SetTime', timeOfDay })
}