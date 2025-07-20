import { Item } from '../types/item';

export function isTodo(
  item: Item | Partial<Item>,
): item is Item & { type: 'todo'; checked: boolean } {
  return item.type === 'todo';
}

// nanoid 대신 간단한 ID 생성 함수
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function createItem(raw: Omit<Item, 'id' | 'createdAt'>): Item {
  const id = generateId();
  const createdAt = new Date().toISOString();

  return {
    ...raw,
    id,
    createdAt,
    checked: raw.type === 'todo' ? (raw.checked ?? false) : undefined,
  };
}

// 반복 루틴을 위한 여러 아이템 생성 함수
export function createRepeatingItems(raw: Omit<Item, 'id' | 'createdAt'>): Item[] {
  // 루틴이 아니거나 반복이 설정되지 않았거나 시작일이 없으면 단일 아이템 생성
  if (raw.type !== 'routine' || !raw.repeat || !raw.startDate) {
    return [createItem(raw)];
  }

  // 루틴 그룹 ID 생성
  const routineGroupId = generateId();

  const items: Item[] = [];
  const startDate = new Date(raw.startDate);
  const endDate = raw.endDate ? new Date(raw.endDate) : null;

  // 적절한 최대 생성 개수 설정
  let maxOccurrences: number;
  switch (raw.repeat) {
    case 'daily':
      maxOccurrences = 30; // 1개월
      break;
    case 'weekly':
      maxOccurrences = 12; // 3개월
      break;
    case 'monthly':
      maxOccurrences = 6; // 6개월
      break;
    case 'yearly':
      maxOccurrences = 2; // 2년
      break;
    default:
      maxOccurrences = 12;
  }

  console.log('Creating repeating routine:', {
    title: raw.title,
    repeat: raw.repeat,
    startDate: raw.startDate,
    endDate: raw.endDate,
    maxOccurrences: maxOccurrences,
  });

  let currentDate = new Date(startDate);
  let occurrenceCount = 0;

  while (occurrenceCount < maxOccurrences) {
    // 종료일이 설정되어 있고 현재 날짜가 종료일을 넘으면 중단
    if (endDate && currentDate > endDate) {
      break;
    }

    // 현재 날짜로 아이템 생성
    const itemData = {
      ...raw,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: undefined, // 반복 아이템은 endDate를 설정하지 않음
      routineGroupId: routineGroupId,
    };

    console.log(`Creating routine item ${occurrenceCount + 1}:`, itemData.startDate);

    items.push(createItem(itemData));

    // 다음 반복 날짜 계산 (새로운 Date 객체 생성으로 안전하게)
    const nextDate = new Date(currentDate);
    switch (raw.repeat) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        console.warn('Unknown repeat cycle:', raw.repeat);
        return items;
    }

    currentDate = nextDate;
    occurrenceCount++;
  }

  console.log(`Created ${items.length} repeating routine items`);
  return items;
}

export function updateItem(item: Item, patch: Partial<Item>): Item {
  const updated = {
    ...item,
    ...patch,
  };

  if (updated.type !== 'todo' && updated.type !== 'routine') {
    delete updated.checked;
  } else {
    if (typeof updated.checked !== 'boolean') {
      updated.checked = false;
    }
  }

  return updated;
}

// 아이템 타입별 우선순위 (높은 순서대로)
const TYPE_PRIORITY = {
  deadline: 1,
  period: 2,
  event: 3,
  routine: 4,
  todo: 5,
};

// 아이템들을 타입 우선순위로 정렬 (체크된 할일은 우선순위 낮춤)
export function sortItemsByPriority(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    let priorityA = TYPE_PRIORITY[a.type as keyof typeof TYPE_PRIORITY] || 999;
    let priorityB = TYPE_PRIORITY[b.type as keyof typeof TYPE_PRIORITY] || 999;

    // 체크된 할일은 우선순위를 낮춤
    if (a.type === 'todo' && a.checked) {
      priorityA += 10;
    }
    if (b.type === 'todo' && b.checked) {
      priorityB += 10;
    }

    // 우선순위가 같고 둘 다 기간형인 경우 시작일 순서로 정렬
    if (priorityA === priorityB && a.type === 'period' && b.type === 'period') {
      if (!a.startDate || !b.startDate) return 0;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }

    return priorityA - priorityB;
  });
}

// 기간형 아이템들을 시작일 순서로 정렬
export function sortPeriodItemsByStartDate(items: Item[]): Item[] {
  const periodItems = items.filter(item => item.type === 'period');
  const otherItems = items.filter(item => item.type !== 'period');

  // 기간형 아이템들을 시작일 순서로 정렬
  const sortedPeriodItems = periodItems.sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  // 다른 아이템들은 기존 우선순위로 정렬
  const sortedOtherItems = sortItemsByPriority(otherItems);

  // 기간형 아이템을 먼저, 그 다음에 다른 아이템들을 배치
  return [...sortedPeriodItems, ...sortedOtherItems];
}

// 특정 날짜의 아이템들을 가져와서 우선순위로 정렬
export function getItemsForDateSorted(items: Item[], date: string): Item[] {
  const dateItems = items.filter(item => {
    // 시작일이 해당 날짜인 경우
    if (item.startDate === date) return true;
    // 종료일이 해당 날짜인 경우
    if (item.endDate === date) return true;
    // 기간에 해당 날짜가 포함되는 경우
    if (item.startDate && item.endDate) {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const targetDate = new Date(date);
      return targetDate >= start && targetDate <= end;
    }
    return false;
  });

  return sortItemsByPriority(dateItems);
}

// 캘린더용 아이템 필터링 (할일, 루틴 제외)
export function getCalendarItems(items: Item[], date: string): Item[] {
  const dateItems = items.filter(item => {
    // 할일과 루틴은 캘린더에서 제외
    if (item.type === 'todo' || item.type === 'routine') return false;

    // 시작일이 해당 날짜인 경우
    if (item.startDate === date) return true;
    // 종료일이 해당 날짜인 경우
    if (item.endDate === date) return true;
    // 기간에 해당 날짜가 포함되는 경우
    if (item.startDate && item.endDate) {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const targetDate = new Date(date);
      return targetDate >= start && targetDate <= end;
    }
    return false;
  });

  return sortItemsByPriority(dateItems);
}

// 기간형 아이템들을 그룹화하여 연속성을 보장
export function groupPeriodItems(items: Item[]): Item[][] {
  const periodItems = items.filter(
    item => item.type === 'period' && item.startDate && item.endDate,
  );
  const groups: Item[][] = [];

  // 기간이 겹치지 않는 그룹으로 분리
  periodItems.forEach(item => {
    let addedToGroup = false;

    for (const group of groups) {
      const hasOverlap = group.some(groupItem => {
        if (!groupItem.startDate || !groupItem.endDate || !item.startDate || !item.endDate)
          return false;
        const itemStart = new Date(item.startDate);
        const itemEnd = new Date(item.endDate);
        const groupItemStart = new Date(groupItem.startDate);
        const groupItemEnd = new Date(groupItem.endDate);

        return itemStart <= groupItemEnd && itemEnd >= groupItemStart;
      });

      if (hasOverlap) {
        group.push(item);
        addedToGroup = true;
        break;
      }
    }

    if (!addedToGroup) {
      groups.push([item]);
    }
  });

  return groups;
}

// 타입별 색상 (밝고 흐린 느낌)
export function getTypeColor(type: string): string {
  switch (type) {
    case 'todo':
      return '#10b981'; // emerald-500 (밝은 초록색)
    case 'event':
      return '#6b7280'; // gray-500 (중간 회색)
    case 'routine':
      return '#f59e0b'; // amber-500 (밝은 주황색)
    case 'deadline':
      return '#ef4444'; // red-500 (밝은 빨간색)
    case 'period':
      return '#3b82f6'; // blue-500 (밝은 파란색)
    default:
      return '#6b7280';
  }
}

// 기간형 아이템 색상 테마 (블루 계열 5가지 색상 순환)
const PERIOD_COLORS = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#0ea5e9', // sky blue
  '#0891b2', // teal
  '#0284c7', // light blue
];

// 기간형 아이템의 색상 할당 관리
let periodColorUsage: { [color: string]: string | null } = {};

// 기간형 아이템에 색상 할당
export function assignPeriodColor(itemId: string, endDate?: string, allItems?: Item[]): string {
  // 기존에 할당된 색상이 있으면 반환
  if (periodColorUsage[itemId]) {
    return periodColorUsage[itemId]!;
  }

  // 현재 날짜
  const now = new Date();

  // 사용 가능한 색상 찾기 (기간이 끝났거나 사용되지 않은 색상)
  let availableColor = null;

  for (const color of PERIOD_COLORS) {
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
    availableColor = PERIOD_COLORS[0];
    // 기존 할당 해제
    delete periodColorUsage[availableColor];
  }

  // 색상 할당
  periodColorUsage[availableColor] = itemId;
  periodColorUsage[itemId] = availableColor;

  return availableColor;
}

// 기간형 아이템 색상 가져오기
export function getPeriodColor(itemId: string, endDate?: string, allItems?: Item[]): string {
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

// 타입별 라벨
export function getTypeLabel(type: string): string {
  switch (type) {
    case 'todo':
      return '할 일';
    case 'event':
      return '이벤트';
    case 'routine':
      return '반복';
    case 'deadline':
      return '마감일';
    case 'period':
      return '기간';
    default:
      return '기타';
  }
}
