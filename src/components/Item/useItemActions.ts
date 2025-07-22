import { Alert } from 'react-native';
import { Item } from '../../types/item';
import { useTimeStore } from '../../store/itemStore';

export function useItemActions(onEditItem?: (item: Item) => void) {
  const { deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

  const handleDelete = (item: Item) => {
    if (item.type === 'routine' && item.routineGroupId) {
      Alert.alert('반복 아이템 삭제', `"${item.title}"을(를) 삭제하시겠습니까?`, [
        { text: '취소', style: 'cancel' },
        {
          text: '이 날짜만',
          style: 'default',
          onPress: () => deleteItem(item.id),
        },
        {
          text: '전체 삭제',
          style: 'destructive',
          onPress: () => deleteRoutineGroup(item.routineGroupId!),
        },
      ]);
    } else {
      Alert.alert('아이템 삭제', `"${item.title}"을(를) 삭제하시겠습니까?`, [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteItem(item.id),
        },
      ]);
    }
  };

  const handleToggleCheck = (item: Item) => {
    if (item.type === 'todo' || item.type === 'routine') {
      updateItem(item.id, { ...item, checked: !item.checked });
    }
  };

  const handleEdit = (item: Item) => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  return { handleDelete, handleToggleCheck, handleEdit };
}
