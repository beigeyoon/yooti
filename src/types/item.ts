export type ItemType = 'event' | 'todo' | 'routine' | 'deadline' | 'period';

export type RepeatCycle = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Item {
  id: string;
  title: string;
  type: ItemType;
  startDate?: string;
  endDate?: string;
  startTime?: string; // 시작 시간 (HH:MM 형식)
  endTime?: string; // 종료 시간 (HH:MM 형식)
  repeat?: RepeatCycle;
  routineGroupId?: string; // 루틴 그룹 식별용
  groups?: GroupLink[];
  note?: string;
  checked?: boolean; // ✅ todo 전용
  createdAt: string;
}

export type GroupType = 'flow' | 'related' | 'dependency' | 'custom';

export interface GroupLink {
  groupId: string;
  type: GroupType;
  order?: number; // ✅ flow일 경우에만 의미 있음
}

export interface Group {
  id: string;
  title: string;
  type: GroupType;
  description?: string;
  createdAt: string;
}
