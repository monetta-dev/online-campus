# Removing Quality Settings UI Plan

## Goal Description
The user requested to remove the quality settings UI as the Pixel Streaming integration now uses fully automatic adaptive bitrate.

## Proposed Changes

### [Components]
#### [MODIFY] [SettingsModal.tsx](file:///home/monetta/src/online-campus/campus-app/src/components/SettingsModal.tsx)
- Remove the "画質設定" section including the buttons for Low/Medium/High.
- Remove `qualityPreference` and `setQualityPreference` from `useAppStore` hook usage.

### [Store]
#### [MODIFY] [useAppStore.ts](file:///home/monetta/src/online-campus/campus-app/src/store/useAppStore.ts)
- Remove `qualityPreference` state.
- Remove `setQualityPreference` action.

## Verification Plan

### Automated Tests
- `npm run build` to ensure no type errors.

### Manual Verification
- Code review: Check for presence of quality settings code.
- User verification: User will check the Settings modal to ensure the UI is gone.
