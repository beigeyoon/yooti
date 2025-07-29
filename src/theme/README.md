# 색상 테마 관리

이 디렉토리는 앱의 모든 색상을 중앙에서 관리하는 테마 시스템입니다.

## 파일 구조

- `colors.ts` - 모든 색상 정의 및 색상 관련 유틸리티 함수

## 사용법

### 1. 색상 변경하기

색상을 변경하려면 `src/theme/colors.ts` 파일의 `COLORS` 객체를 수정하면 됩니다:

```typescript
export const COLORS = {
  itemTypes: {
    todo: '#10b981',      // 할일 색상
    event: '#6b7280',     // 이벤트 색상
    routine: '#ea580c',   // 반복 색상 ← 이 부분을 수정
    deadline: '#ef4444',  // 마감일 색상
    period: '#3b82f6',    // 기간 색상
  },
  // ...
}
```

### 2. 컴포넌트에서 색상 사용하기

```typescript
import { getItemTypeColor as getTypeColor, getPeriodColor, COLORS } from '../theme/colors';

// 아이템 타입별 색상 가져오기
const color = getTypeColor('routine'); // '#ea580c'

// 기간형 아이템 색상 가져오기
const periodColor = getPeriodColor(itemId, endDate, allItems);

// UI 색상 직접 사용
const backgroundColor = COLORS.ui.background;
const textColor = COLORS.ui.text.primary;
```

### 3. 새로운 색상 추가하기

새로운 색상이 필요하면 `COLORS` 객체에 추가하면 됩니다:

```typescript
export const COLORS = {
  itemTypes: {
    // 기존 색상들...
    newType: '#your-color-here', // 새로운 타입 색상
  },
  ui: {
    // 기존 UI 색상들...
    newColor: '#your-ui-color', // 새로운 UI 색상
  },
  // ...
}
```

## 색상 체계

### 아이템 타입별 색상
- `todo`: 블루색 (#3b82f6) - 할일
- `event`: 귤색 (#f97316) - 이벤트
- `routine`: 보라색 (#8b5cf6) - 반복
- `deadline`: 핑크색 (#ec4899) - 마감일
- `period`: 밝은 민트색 (#06b6d4) - 기간

### 기간형 아이템 색상
기간형 아이템은 5가지 밝은 민트 계열 색상이 순환됩니다:
- `#06b6d4` (cyan-500)
- `#0891b2` (cyan-600)
- `#0e7490` (cyan-700)
- `#155e75` (cyan-800)
- `#164e63` (cyan-900)

### UI 색상
- `background`: 배경색 (#f8fafc)
- `white`: 흰색 (#ffffff)
- `border`: 테두리색 (#d1d5db)
- `text.primary`: 주요 텍스트 (#111827)
- `text.secondary`: 보조 텍스트 (#374151)
- `text.tertiary`: 3차 텍스트 (#6b7280)
- `text.muted`: 흐린 텍스트 (#9ca3af)

## 장점

1. **중앙 집중식 관리**: 모든 색상이 한 곳에서 관리됩니다
2. **일관성**: 앱 전체에서 일관된 색상 사용
3. **쉬운 수정**: 색상 변경 시 한 곳만 수정하면 됩니다
4. **타입 안전성**: TypeScript로 색상 타입이 보장됩니다
5. **재사용성**: 색상을 쉽게 재사용할 수 있습니다

## 주의사항

- 색상 변경 시 기존 함수명(`getTypeColor`, `getPeriodColor`)은 그대로 유지됩니다
- 새로운 색상을 추가할 때는 적절한 주석을 달아주세요
- 색상 코드는 16진수 형식(#RRGGBB)을 사용합니다 