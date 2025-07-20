import { create } from 'zustand';
import { Item, Group } from '@/types/item';
import { createItem, createRepeatingItems, updateItem as applyUpdate } from '@/utils/itemUtils';
import { saveToStorage, loadFromStorage } from '@/utils/storage';

const STORAGE_KEY = 'yooti_store';

interface ItemState {
  items: Item[];
  groups: Group[];
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  deleteRoutineGroup: (routineGroupId: string) => void;
  deleteAllItems: () => void;
  addGroup: (group: Group) => void;
  updateGroup: (id: string, patch: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  load: () => Promise<void>;
}

export const useTimeStore = create<ItemState>((set, get) => ({
  items: [],
  groups: [],

  addItem: raw => {
    const newItems = createRepeatingItems(raw);
    const updated = [...get().items, ...newItems];
    saveToStorage(STORAGE_KEY, { items: updated, groups: get().groups });
    set({ items: updated });
  },

  updateItem: (id, patch) => {
    const updated = get().items.map(item => (item.id === id ? applyUpdate(item, patch) : item));
    saveToStorage(STORAGE_KEY, { items: updated, groups: get().groups });
    set({ items: updated });
  },

  deleteItem: id => {
    const updated = get().items.filter(item => item.id !== id);
    saveToStorage(STORAGE_KEY, { items: updated, groups: get().groups });
    set({ items: updated });
  },

  deleteRoutineGroup: (routineGroupId: string) => {
    const updated = get().items.filter(item => item.routineGroupId !== routineGroupId);
    saveToStorage(STORAGE_KEY, { items: updated, groups: get().groups });
    set({ items: updated });
  },

  deleteAllItems: () => {
    saveToStorage(STORAGE_KEY, { items: [], groups: get().groups });
    set({ items: [] });
  },

  addGroup: group => {
    const updated = [...get().groups, group];
    saveToStorage(STORAGE_KEY, { items: get().items, groups: updated });
    set({ groups: updated });
  },

  updateGroup: (id, patch) => {
    const updated = get().groups.map(group => (group.id === id ? { ...group, ...patch } : group));
    saveToStorage(STORAGE_KEY, { items: get().items, groups: updated });
    set({ groups: updated });
  },

  deleteGroup: id => {
    const updatedGroups = get().groups.filter(g => g.id !== id);
    const updatedItems = get().items.map(item => ({
      ...item,
      groups: item.groups?.filter(g => g.groupId !== id),
    }));
    saveToStorage(STORAGE_KEY, { items: updatedItems, groups: updatedGroups });
    set({ items: updatedItems, groups: updatedGroups });
  },

  load: async () => {
    const stored = await loadFromStorage<Pick<ItemState, 'items' | 'groups'>>(STORAGE_KEY);
    if (stored) {
      set(stored);
    }
  },
}));
