import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../types/item';
import { useTimeStore } from '../store/itemStore';
import {
  getItemsForDateSorted,
  getTypeLabel,
  sortPeriodItemsByStartDate,
} from '../utils/itemUtils';
import { getItemTypeColor as getTypeColor, getPeriodColor } from '../theme/colors';
import dayjs from 'dayjs';
import ItemCard from './Item/ItemCard';

interface DailyDetailProps {
  selectedDate: string | null;
  onEditItem?: (item: Item) => void;
}

export default function DailyDetail({ selectedDate, onEditItem }: DailyDetailProps) {
  const { items, groups, deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

  const handleDelete = (item: Item) => {
    // 반복 아이템인 경우 선택 옵션 제공
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
      // 일반 아이템은 기존 로직
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

  const selectedDateItems = selectedDate
    ? sortPeriodItemsByStartDate(getItemsForDateSorted(items, selectedDate))
    : sortPeriodItemsByStartDate(getItemsForDateSorted(items, dayjs().format('YYYY-MM-DD')));

  // 기간형 아이템의 개별 색상 가져오기
  const getItemColor = (item: Item) => {
    if (item.type === 'period') {
      return getPeriodColor(item.id, item.endDate, items);
    }
    return getTypeColor(item.type);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151' }}>
          {selectedDate
            ? dayjs(selectedDate).format('M월 D일') + ' (' + dayjs(selectedDate).format('ddd') + ')'
            : dayjs().format('M월 D일') + ' (' + dayjs().format('ddd') + ')'}
        </Text>
      </View>

      {selectedDateItems.length === 0 ? (
        <Text style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', paddingVertical: 20 }}>
          이 날의 아이템이 없어요
        </Text>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
          {selectedDateItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleCheck={handleToggleCheck}
              getItemColor={getItemColor}
              groups={groups}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
