import { useAppStore } from '../store/useAppStore'

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
    const { qualityPreference, setQualityPreference, isUE5Connected } = useAppStore()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 背景クリックで閉じるためのオーバーレイ */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">設定</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    {/* 画質設定セクション */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
                            <span>📺</span> 画質設定
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            ストリーミングの品質を調整します。回線速度に合わせて選択してください。
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            {(['low', 'medium', 'high'] as const).map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setQualityPreference(q)}
                                    className={`
                    py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1
                    ${qualityPreference === q
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                        }
                  `}
                                >
                                    <span className="font-bold capitalize">{q === 'low' ? '低画質' : q === 'medium' ? '標準' : '高画質'}</span>
                                    <span className="text-xs opacity-70">
                                        {q === 'low' ? '軽量・安定' : q === 'medium' ? 'バランス' : '最高品質'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {!isUE5Connected && (
                            <p className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                                ⚠️ UE5に接続されていないため、設定は接続後に適用されます。
                            </p>
                        )}

                        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-500 font-mono">
                            <div>Bitrate: {qualityPreference === 'low' ? '2Mbps' : qualityPreference === 'medium' ? '10Mbps' : '50Mbps'}</div>
                            <div>Framerate: {qualityPreference === 'low' ? '30fps' : '60fps'}</div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <button
                            className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-lg"
                            onClick={onClose}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
