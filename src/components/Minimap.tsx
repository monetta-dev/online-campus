import { useAppStore } from '../store/useAppStore'

const Minimap = () => {
  const { isMinimapExpanded, toggleMinimap } = useAppStore()

  if (isMinimapExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-transparent flex items-center justify-center">
        <div className="relative w-[90vw] h-[90vh] max-w-4xl max-h-4xl bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-lg p-8">
          <div className="absolute top-4 right-4">
            <button
              className="bg-transparent hover:bg-white/10 rounded-full p-2 text-black z-50 pointer-events-auto transition-colors"
              onClick={() => {
                console.log('Minimap toggle clicked')
                toggleMinimap()
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-center text-black mb-6">
            <h2 className="text-2xl font-bold">キャンパスマップ</h2>
            <p className="text-black/60">拡大表示</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/50 to-purple-600/50 rounded-xl w-full h-[calc(100%-80px)] flex items-center justify-center">
            <div className="text-black/40 text-lg">マップ画像（実装予定）</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      className="bg-transparent rounded-full w-32 h-32 flex items-center justify-center hover:scale-105 transition-transform z-40 pointer-events-auto shadow-sm"
      onClick={() => {
        console.log('Minimap close clicked')
        toggleMinimap()
      }}
    >
      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 overflow-hidden">
        {/* ダミーのマップ要素 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/50 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-green-400/50 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400/50 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-red-400/50 rounded-full" />
      </div>
      <div className="absolute bottom-2 text-xs text-black/60">クリックで拡大</div>
    </button>
  )
}

export default Minimap