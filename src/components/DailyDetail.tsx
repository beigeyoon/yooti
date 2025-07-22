import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Item } from '../types/item';
import { useTimeStore } from '../store/itemStore';
import { getItemsForDateSorted, sortPeriodItemsByStartDate } from '../utils/itemUtils';
import { getItemTypeColor as getTypeColor, getPeriodColor } from '../theme/colors';
import dayjs from 'dayjs';
import ItemCard from './Item/ItemCard';
import { useItemActions } from './Item/useItemActions';

interface DailyDetailProps {
  selectedDate: string | null;
  onEditItem?: (item: Item) => void;
}

export default function DailyDetail({ selectedDate, onEditItem }: DailyDetailProps) {
  const { items, groups, deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

  const { handleDelete, handleToggleCheck, handleEdit } = useItemActions(onEditItem);

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
