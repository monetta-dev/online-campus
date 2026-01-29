import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import LocationIndicator from './components/LocationIndicator'
import HamburgerMenu from './components/HamburgerMenu'
import ControlsGuide from './components/ControlsGuide'
import Minimap from './components/Minimap'
import SmartSearchBar from './components/SmartSearchBar'
import InfoSidePanel from './components/InfoSidePanel'
import Background from './components/Background'
import PixelStreamingWrapper from './components/PixelStreamingWrapper'
import TimeSelector from './components/TimeSelector'
import './App.css'

const USE_PIXEL_STREAMING = true

function App() {
  const { isSidePanelOpen, isSearchBarOpen, toggleSearchBar, closeSidePanel, initializePSBridge, isUE5Connected } = useAppStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        toggleSearchBar()
      } else if (e.key === 'Escape') {
        closeSidePanel()
        if (isSearchBarOpen) {
          toggleSearchBar()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSearchBar, closeSidePanel, isSearchBarOpen])

  useEffect(() => {
    const cleanup = initializePSBridge()
    return cleanup
  }, [initializePSBridge])

  return (
    <div className="relative w-screen h-screen overflow-hidden pointer-events-auto">
      {/* 背景 */}
      {USE_PIXEL_STREAMING ? <PixelStreamingWrapper /> : <Background />}

      {/* グローバルUI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* 左上: ロケーションインジケーター & 時間選択 */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
          <LocationIndicator />
          <TimeSelector />
        </div>

        {/* 右上: UE5接続状態 & ハンバーガーメニュー */}
        <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
          {/* UE5接続状態インジケーター */}
          <div className={`px-3 py-1.5 rounded-lg text-sm border shadow-xl backdrop-blur-sm bg-white/20 border-white/40 text-black`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isUE5Connected ? 'bg-green-500' : 'bg-gray-500'}`} />
              <span>{isUE5Connected ? 'UE5接続済み' : 'UE5接続中...'}</span>
            </div>
          </div>
          <HamburgerMenu />
        </div>

        {/* 右下: 操作ガイド */}
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <ControlsGuide />
        </div>

        {/* 左下: ミニマップ */}
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <Minimap />
        </div>
      </div>

      {/* インタラクティブUI */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* 中央下部: スマート検索バー */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isSearchBarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <SmartSearchBar />
        </div>

        {/* 右側: 情報サイドパネル */}
        <div className={`absolute right-0 top-0 h-full transition-transform duration-500 pointer-events-auto ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <InfoSidePanel />
        </div>
      </div>

      {/* 検索バー起動ボタン（画面下中央） */}
      {!isSearchBarOpen && (
        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-full px-6 py-3 text-black hover:bg-white/30 transition-all z-30 pointer-events-auto"
          onClick={() => {
            console.log('Search bar toggle button clicked')
            toggleSearchBar()
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>検索</span>
            <kbd className="ml-2 px-2 py-1 text-xs bg-black/10 rounded border-none">/</kbd>
          </div>
        </button>
      )}
    </div>
  )
}

export default App
