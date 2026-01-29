import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { campusData } from '../data/campusData'

const SmartSearchBar = () => {
  const { toggleSearchBar, openSidePanel, selectBuilding } = useAppStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const filteredBuildings = campusData.filter(building =>
    building.name.toLowerCase().includes(query.toLowerCase()) ||
    building.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleSearchBar()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filteredBuildings.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredBuildings.length) % filteredBuildings.length)
    } else if (e.key === 'Enter' && filteredBuildings.length > 0) {
      const building = filteredBuildings[selectedIndex]
      handleSelectBuilding(building)
    }
  }

  const handleSelectBuilding = (building: typeof campusData[0]) => {
    console.log(`Selected: ${building.name}`)
    selectBuilding(building.id)
    openSidePanel()
    toggleSearchBar()
    // 自動移動はせず、InfoSidePanelでユーザーがアクションを選択する
  }

  return (
    <div className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-lg p-4 w-[600px] max-w-[90vw] shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-black text-lg placeholder-black/40 border-none outline-none rounded px-3 py-2"
          placeholder="建物名またはカテゴリを入力..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="text-black/60 hover:text-black pointer-events-auto"
          onClick={toggleSearchBar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {query && (
        <div className="border-t border-black/10 pt-3">
          <div className="text-black/60 text-sm mb-2">検索結果 ({filteredBuildings.length})</div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {filteredBuildings.length === 0 ? (
              <div className="text-black/60 py-4 text-center">該当する建物がありません</div>
            ) : (
              filteredBuildings.map((building, index) => (
                <button
                  key={building.id}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors pointer-events-auto ${index === selectedIndex ? 'bg-transparent text-black border border-black/20' : 'text-black hover:bg-transparent hover:border hover:border-black/10'}`}
                  onClick={() => handleSelectBuilding(building)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div>
                    <div className="font-medium">{building.name}</div>
                    <div className="text-black/60 text-sm">{building.category}</div>
                  </div>
                  <div className="text-black/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-black/10 text-black/60 text-sm">
        <div className="flex items-center gap-4">
          <span>↑↓ で選択</span>
          <span>Enter で決定</span>
          <span>ESC で閉じる</span>
        </div>
      </div>
    </div>
  )
}

export default SmartSearchBar