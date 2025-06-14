import { Item } from '@/types/item';
import { nanoid } from 'nanoid';

export function isTodo(
  item: Item | Partial<Item>,
): item is Item & { type: 'todo'; checked: boolean } {
  return item.type === 'todo';
}

export function createItem(raw: Omit<Item, 'id' | 'createdAt'>): Item {
  const id = nanoid();
  const createdAt = new Date().toISOString();

  return {
    ...raw,
    id,
    createdAt,
    checked: raw.type === 'todo' ? (raw.checked ?? false) : undefined,
  };
}

export function updateItem(item: Item, patch: Partial<Item>): Item {
  const updated = {
    ...item,
    ...patch,
  };

  if (updated.type !== 'todo') {
    delete updated.checked;
  } else {
    if (typeof updated.checked !== 'boolean') {
      updated.checked = false;
    }
  }

  return updated;
}
