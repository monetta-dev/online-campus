// import { useAppStore } from '../store/useAppStore'

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
    // const { isUE5Connected } = useAppStore()

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
