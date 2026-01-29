import { create } from 'zustand'
import { psBridge, teleport as psTeleport, startPathfinding as psStartPathfinding, setTime as psSetTime, type UE5Event } from '../utils/PSBridge'
import type { TimeOfDay } from '../types'
import { getLocationDisplayName } from '../data/campusData'

interface AppState {
  // 現在地
  currentLocation: string
  // 選択された建物ID
  selectedBuildingId: string | null
  // 時間帯
  timeOfDay: TimeOfDay
  // サイドパネルの表示状態
  isSidePanelOpen: boolean
  // 検索バーの表示状態
  isSearchBarOpen: boolean
  // ミニマップの拡大状態
  isMinimapExpanded: boolean
  // 操作ガイドの表示状態
  showControlsGuide: boolean
  // UE5接続状態
  // UE5接続状態
  isUE5Connected: boolean


  // アクション
  setCurrentLocation: (location: string) => void
  selectBuilding: (buildingId: string | null) => void
  setTimeOfDay: (time: TimeOfDay) => void

  toggleSidePanel: () => void
  openSidePanel: () => void
  closeSidePanel: () => void
  toggleSearchBar: () => void
  toggleMinimap: () => void
  setShowControlsGuide: (show: boolean) => void
  setUE5Connected: (connected: boolean) => void

  // UE5へのコマンド（PSBridge経由）
  teleport: (locationId: string) => void
  startPathfinding: (destinationId: string) => void

  // PSBridgeイベントリスナーの初期化
  initializePSBridge: () => () => void // クリーンアップ関数を返す
}

export const useAppStore = create<AppState>((set, get) => ({
  currentLocation: '中央図書館前',
  selectedBuildingId: null,
  timeOfDay: 'day',
  isSidePanelOpen: false,
  isSearchBarOpen: false,
  isMinimapExpanded: false,
  showControlsGuide: true,
  isUE5Connected: false,



  setCurrentLocation: (location) => set({ currentLocation: location }),
  selectBuilding: (buildingId) => set({ selectedBuildingId: buildingId }),
  setTimeOfDay: (time) => {
    set({ timeOfDay: time })
    // PSBridge経由でUE5に時間設定を送信
    psSetTime(time)
  },

  toggleSidePanel: () => set((state) => ({ isSidePanelOpen: !state.isSidePanelOpen })),
  openSidePanel: () => set({ isSidePanelOpen: true }),
  closeSidePanel: () => set({ isSidePanelOpen: false }),
  toggleSearchBar: () => set((state) => ({ isSearchBarOpen: !state.isSearchBarOpen })),
  toggleMinimap: () => set((state) => ({ isMinimapExpanded: !state.isMinimapExpanded })),
  setShowControlsGuide: (show) => set({ showControlsGuide: show }),
  setUE5Connected: (connected) => set({ isUE5Connected: connected }),

  teleport: (locationId) => {
    console.log(`[AppStore] Teleport to ${locationId}`)
    psTeleport(locationId)
    // イベント経由で現在地が更新される
  },

  startPathfinding: (destinationId) => {
    console.log(`[AppStore] Start pathfinding to ${destinationId}`)
    psStartPathfinding(destinationId)
    // 移動中表示
    set({ currentLocation: `移動中: ${destinationId}` })
  },

  initializePSBridge: () => {
    console.log('[AppStore] Initializing PSBridge listener')

    // UE5接続状態の監視
    const checkConnection = setInterval(() => {
      const connected = psBridge.getIsConnected()
      if (connected !== get().isUE5Connected) {
        set({ isUE5Connected: connected })
      }
    }, 1000)

    // UE5イベントリスナー
    const handleUE5Event = (event: UE5Event) => {
      console.log('[AppStore] Received UE5 event:', event)

      switch (event.type) {
        case 'OnAreaEntered':
          // エリアに入ったらサイドパネルを開く
          set({ selectedBuildingId: event.areaId })
          get().openSidePanel()
          break

        case 'OnCameraArrived':
          // カメラ到着で現在地更新
          const locationName = getLocationDisplayName(event.locationId)
          set({ currentLocation: locationName })
          break
      }
    }

    // リスナー登録
    psBridge.addEventListener(handleUE5Event)

    // クリーンアップ関数
    return () => {
      clearInterval(checkConnection)
      psBridge.removeEventListener(handleUE5Event)
      console.log('[AppStore] Cleaned up PSBridge listener')
    }
  },
}))