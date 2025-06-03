export type ItemType = 'event' | 'todo' | 'routine' | 'deadline' | 'period';

export type RepeatCycle = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Item =
  | {
      id: string;
      title: string;
      type: 'todo';
      checked: boolean;
      startDate?: string;
      endDate?: string;
      repeat?: RepeatCycle;
      groups?: GroupLink[];
      note?: string;
      createdAt: string;
    }
  | {
      id: string;
      title: string;
      type: Exclude<ItemType, 'todo'>;
      startDate?: string;
      endDate?: string;
      repeat?: RepeatCycle;
      groups?: GroupLink[];
      note?: string;
      createdAt: string;
    };

export type GroupType = 'flow' | 'related' | 'dependency' | 'custom';

export type GroupLink =
  | {
      groupId: string;
      type: 'flow';
      order: number;
    }
  | {
      groupId: string;
      type: Exclude<GroupType, 'flow'>;
    };

export interface Group {
  id: string;
  title: string;
  type: GroupType;
  description?: string;
  createdAt: string;
}
