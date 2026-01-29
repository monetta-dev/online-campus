# Pixel Streaming Bitrate Optimization

- [x] Remove fixed bitrate settings from `PSBridge.ts` initial configuration <!-- id: 0 -->
- [x] Update `setQuality` method to rely on QP/FPS or wide bitrate ranges instead of fixed constraints <!-- id: 1 -->
- [x] Verify changes <!-- id: 2 -->

# Aggressive Smoothness Optimization
- [x] Configure `PSBridge.ts` for maximum adaptability (Wide Bitrate Range, High QP limit) <!-- id: 3 -->
- [x] Verify `setQuality` is disabled/neutralized <!-- id: 4 -->

# UI Cleanup
- [x] Remove quality settings UI from `SettingsModal.tsx` <!-- id: 5 -->
- [x] Remove quality state and action from `useAppStore.ts` <!-- id: 6 -->
