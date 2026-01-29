import { useAppStore } from '../store/useAppStore'
import { buildingsById, defaultBuilding } from '../data/campusData'

const InfoSidePanel = () => {
  const { selectedBuildingId, closeSidePanel, teleport } = useAppStore()
  const data = selectedBuildingId && buildingsById[selectedBuildingId]
    ? buildingsById[selectedBuildingId]
    : defaultBuilding

  return (
    <div className="h-[calc(100%-2rem)] w-full m-4 bg-white/20 backdrop-blur-sm border border-white/40 rounded-lg flex flex-col z-40 shadow-xl">
      <div className="p-6 border-b border-black/10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">建物詳細</h2>
          <button
            className="text-black/60 hover:text-black pointer-events-auto"
            onClick={() => {
              console.log('InfoSidePanel close button clicked')
              closeSidePanel()
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* イメージエリア */}
        <div className={`${data.imageColor} rounded-xl h-48 mb-6 flex items-center justify-center`}>
          <div className="text-black text-center">
            <div className="text-4xl mb-2">🏛️</div>
            <div className="text-xl font-bold">{data.name}</div>
          </div>
        </div>

        {/* 説明 */}
        <div className="mb-6">
          <h3 className="text-black font-bold mb-2">説明</h3>
          <p className="text-black leading-relaxed">{data.description}</p>
        </div>

        {/* 特徴 */}
        {data.features.length > 0 && (
          <div className="mb-6">
            <h3 className="text-black font-bold mb-3">主な設備・特徴</h3>
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-transparent text-black border border-black/10 rounded-full px-3 py-1 text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* リンク */}
        {data.links.length > 0 && (
          <div className="mb-6">
            <h3 className="text-black font-bold mb-3">関連リンク</h3>
            <div className="space-y-2">
              {data.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="block bg-transparent hover:bg-transparent text-black border border-black/10 hover:border-black/30 rounded-lg p-3 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-between">
                    <span>{link.label}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="space-y-3">
          <button
            className="w-full bg-transparent border border-blue-600 hover:border-blue-700 text-black rounded-lg py-3 font-medium transition-colors pointer-events-auto"
            onClick={() => {
              console.log(`Navigate to ${selectedBuildingId}`)
              closeSidePanel()
            }}
          >
            この建物へ案内 (徒歩)
          </button>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-medium transition-colors pointer-events-auto flex items-center justify-center gap-2 shadow-lg"
            onClick={() => {
              console.log(`Teleport to ${selectedBuildingId}`)
              if (selectedBuildingId) {
                teleport(selectedBuildingId)
                closeSidePanel()
              }
            }}
          >
            <span>🚀</span>
            <span>テレポート (瞬時に移動)</span>
          </button>

          <button
            className="w-full bg-transparent hover:bg-transparent text-black border border-black/10 hover:border-black/30 rounded-lg py-3 font-medium transition-colors pointer-events-auto"
            onClick={() => {
              console.log('InfoSidePanel bottom close button clicked')
              closeSidePanel()
            }}
          >
            閉じる
          </button>
        </div>
      </div>

    </div>

  )
}

export default InfoSidePanel