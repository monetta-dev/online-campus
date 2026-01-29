/**
 * STEP 3で使用するUE5 Pixel Streamingラッパーコンポーネント
 * 背景動画の代わりに、実際のUE5キャンパスをストリーミング表示します。
 * 
 * 使用例:
 * import PixelStreamingWrapper from './components/PixelStreamingWrapper'
 * 
 * // App.tsxでBackgroundの代わりに使用
 * <PixelStreamingWrapper />
 */

import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { psBridge } from '../utils/PSBridge'

const PixelStreamingWrapper = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isUE5Connected } = useAppStore()

  useEffect(() => {
    // 実際にDOMにマウントされたら、Video要素をアタッチする
    if (containerRef.current) {
      console.log('[PixelStreamingWrapper] Mount: Connecting and attaching video')

      // 接続開始
      psBridge.connect()

      // psBridgeのpixelStreamingインスタンスが管理するvideo要素をここに追加するよう指示
      // @epicgames/pixel-streamingの仕様では、通常は document.body または指定要素に append される
      // ここでは psBridge に機能を追加するか、直接コンフィグで指定するが、
      // 既存のインスタンスに対してターゲット要素を指定するメソッドがない場合があるため、
      // 簡易的に _videoElement を appendChild する

      // 注: ライブラリのバージョンによっては自動的になされるが、
      // ここでは明示的にコンテナを使えるように確認が必要。
      // いったん、デフォルトのWebComponent的な挙動ではなく、
      // PixelStreamingインスタンスからVideo要素を取り出して配置する、または
      // Configでこの要素を指定する方が行儀が良いが、
      // psBridgeですでに初期化済みのため、ここで親要素として設定できるか試みる。

      // PixelStreamingのattachToなどは公開されていない場合があるため、
      // WebRtcPlayerControllerのvideoElementを取得してappendする

      // PixelStreamingの仕様に基づき、videoElementParentを取得して格納する
      const videoParent = psBridge.pixelStreaming.videoElementParent
      if (videoParent) {
        containerRef.current.innerHTML = '' // クリア
        containerRef.current.appendChild(videoParent)
        // 必要に応じてスタイル調整
        // videoParent自体はDIVなので、その中のVideoが正しく表示されるようにする
        videoParent.style.width = '100%'
        videoParent.style.height = '100%'
        videoParent.style.pointerEvents = 'auto' // 明示的に操作許可

        // 念のため、videoタグそのものにも適用
        const videoTag = videoParent.querySelector('video')
        if (videoTag) {
          videoTag.style.pointerEvents = 'auto'
        }
      } else {
        console.warn('[PixelStreamingWrapper] Video parent element not available')
      }
    }

    return () => {
      // クリーンアップ
      console.log('[PixelStreamingWrapper] Cleaning up view')
      psBridge.disconnect()
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      {/* STEP 3: 実際のUE5ストリームが表示される領域 */}
      <div
        ref={containerRef}
        className="absolute inset-0 bg-transparent pointer-events-auto"
      >
        {/* プレースホルダー */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-black/80 pointer-events-none">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-2">UE5 Virtual Campus</h2>
            <p className="mb-4">STEP 3でここに実際のUE5キャンパスが表示されます</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200/50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${isUE5Connected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span>{isUE5Connected ? 'UE5接続済み' : 'UE5未接続'}</span>
            </div>
            <div className="mt-6 text-sm text-black/60">
              <p>サーバー: campus.monetam.xyz</p>
              <p>技術: Unreal Engine 5 Pixel Streaming</p>
            </div>
          </div>
        </div>
      </div>

      {/* オーバーレイUIのための透過レイヤー */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* グリッドパターン（デバッグ用） */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>
    </div>
  )
}

export default PixelStreamingWrapper