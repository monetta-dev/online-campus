import { useAppStore } from '../store/useAppStore'
import { useEffect, useState } from 'react'

const ControlsGuide = () => {
  const { showControlsGuide, setShowControlsGuide } = useAppStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])



  return (
    <>
      {!showControlsGuide ? (
        <button
          className="bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-full w-10 h-10 flex items-center justify-center text-black hover:bg-white/30 transition-colors pointer-events-auto"
          onClick={() => setShowControlsGuide(true)}
          title="操作ガイドを表示"
        >
          <span className="text-xl">?</span>
        </button>
      ) : (
        <div className="bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-lg px-4 py-3 text-black max-w-xs z-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">操作ガイド</span>
            <button
              className="text-black/60 hover:text-black z-50 pointer-events-auto"
              onClick={() => {
                console.log('ControlsGuide close clicked')
                setShowControlsGuide(false)
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {isMobile ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-transparent rounded px-2 py-1 font-bold">ドラッグ</div>
                  <span>視点変更</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-transparent rounded px-2 py-1 font-bold">タップ</div>
                  <span>建物選択</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-transparent rounded px-2 py-1 font-bold">ピンチ</div>
                  <span>ズーム</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <kbd className="bg-transparent rounded px-2 py-1 font-mono font-bold">W</kbd>
                  <kbd className="bg-transparent rounded px-2 py-1 font-mono font-bold">A</kbd>
                  <kbd className="bg-transparent rounded px-2 py-1 font-mono font-bold">S</kbd>
                  <kbd className="bg-transparent rounded px-2 py-1 font-mono font-bold">D</kbd>
                  <span>移動</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <kbd className="bg-transparent rounded px-2 py-1 font-bold">マウスドラッグ</kbd>
                  <span>視点変更</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <kbd className="bg-transparent rounded px-2 py-1 font-bold">ESC</kbd>
                  <span>操作解除</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <kbd className="bg-transparent rounded px-2 py-1 font-bold">/</kbd>
                  <span>検索バー</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ControlsGuide