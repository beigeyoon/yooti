// 색상 테마 관리
export const COLORS = {
  // 아이템 타입별 색상
  itemTypes: {
    todo: '#3b82f6', // blue-500 (블루)
    event: '#f97316', // orange-500 (밝은 귤색)
    routine: '#8b5cf6', // violet-500 (보라)
    deadline: '#ec4899', // pink-500 (핑크)
    period: '#06b6d4', // cyan-500 (밝은 민트)
  },

  // 기간형 아이템 색상 테마 (밝은 민트 계열 5가지 색상 순환)
  periodColors: [
    '#06b6d4', // cyan-500 (밝은 민트)
    '#0891b2', // cyan-600 (진한 밝은 민트)
    '#0e7490', // cyan-700 (더 진한 밝은 민트)
    '#155e75', // cyan-800 (어두운 밝은 민트)
    '#164e63', // cyan-900 (매우 어두운 밝은 민트)
  ],

  // UI 색상
  ui: {
    background: '#f8fafc',
    white: '#ffffff',
    border: '#d1d5db',
    borderLight: '#e5e7eb',
    text: {
      primary: '#111827',
      secondary: '#374151',
      tertiary: '#6b7280',
      muted: '#9ca3af',
    },
    success: '#10b981', // emerald-500
    danger: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    info: '#3b82f6', // blue-500
  },

  // 상태 색상
  status: {
    checked: '#9ca3af', // 체크된 아이템 텍스트 색상
    completed: '#10b981', // 완료 상태 색상
  },
} as const;

// 타입 정의
export type ItemTypeColor = keyof typeof COLORS.itemTypes;
export type PeriodColor = (typeof COLORS.periodColors)[number];

// 아이템 타입별 색상 가져오기
export function getItemTypeColor(type: string): string {
  return COLORS.itemTypes[type as ItemTypeColor] || COLORS.ui.text.tertiary;
}

// 기간형 아이템 색상 할당 관리
let periodColorUsage: { [color: string]: string | null } = {};

// 기간형 아이템에 색상 할당
export function assignPeriodColor(itemId: string, endDate?: string, allItems?: any[]): string {
  // 기존에 할당된 색상이 있으면 반환
  if (periodColorUsage[itemId]) {
    return periodColorUsage[itemId]!;
  }

  // 현재 날짜
  const now = new Date();

  // 사용 가능한 색상 찾기 (기간이 끝났거나 사용되지 않은 색상)
  let availableColor = null;

  for (const color of COLORS.periodColors) {
    const assignedItemId = periodColorUsage[color];

    // 색상이 사용되지 않았으면 사용 가능
    if (!assignedItemId) {
      availableColor = color;
      break;
    }

    // 할당된 아이템의 기간이 끝났는지 확인
    if (allItems) {
      const assignedItem = allItems.find(item => item.id === assignedItemId);
      if (assignedItem && assignedItem.endDate) {
        const itemEndDate = new Date(assignedItem.endDate);
        if (itemEndDate < now) {
          // 기간이 끝났으므로 색상 해제
          delete periodColorUsage[color];
          availableColor = color;
          break;
        }
      }
    }
  }

  // 사용 가능한 색상이 없으면 첫 번째 색상 사용
  if (!availableColor) {
    availableColor = COLORS.periodColors[0];
    // 기존 할당 해제
    delete periodColorUsage[availableColor];
  }

  // 색상 할당
  periodColorUsage[availableColor] = itemId;
  periodColorUsage[itemId] = availableColor;

  return availableColor;
}

// 기간형 아이템 색상 가져오기
export function getPeriodColor(itemId: string, endDate?: string, allItems?: any[]): string {
  return assignPeriodColor(itemId, endDate, allItems);
}

// 기간형 아이템 색상 해제 (아이템 삭제 시)
export function releasePeriodColor(itemId: string): void {
  const color = periodColorUsage[itemId];
  if (color) {
    delete periodColorUsage[color];
    delete periodColorUsage[itemId];
  }
}
