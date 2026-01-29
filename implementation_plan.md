# Teleport Integration Plan

## Goal Description
Integrate the "Teleport" functionality into the `InfoSidePanel` so users can choose to teleport to a building after selecting it from the search bar. This replaces the temporary debug button and the automatic pathfinding behavior.

## Proposed Changes

### [Components]
#### [MODIFY] [PixelStreamingWrapper.tsx](file:///home/monetta/src/online-campus/campus-app/src/components/PixelStreamingWrapper.tsx)
- Remove the temporary "Test Teleport" debug button.
- Remove unused `teleport` import.

#### [MODIFY] [SmartSearchBar.tsx](file:///home/monetta/src/online-campus/campus-app/src/components/SmartSearchBar.tsx)
- Remove `startPathfinding` call when selecting a building. Selection should only open the side panel.

#### [MODIFY] [InfoSidePanel.tsx](file:///home/monetta/src/online-campus/campus-app/src/components/InfoSidePanel.tsx)
- Import `teleport` action from `useAppStore`.
- Add a "Teleport (瞬時に移動)" button below the existing "Navigate" button.

## Verification Plan

### Automated Tests
- `npm run build` to ensure type safety.

### Manual Verification
- Code review: Ensure clean removal of debug code.
- User verification:
    1.  Select a building from Search.
    2.  Verify camera does NOT move automatically.
    3.  Verify SidePanel opens.
    4.  Click "Teleport" button.
    5.  Verify UE5 receives Teleport command (logs).
