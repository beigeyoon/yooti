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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
            {(() => {
              const date = selectedDate ? dayjs(selectedDate) : dayjs();
              const days = ['일', '월', '화', '수', '목', '금', '토'];
              return date.format('M월 D일') + ' (' + days[date.day()] + ')';
            })()}
          </Text>
          {(() => {
            const date = selectedDate ? dayjs(selectedDate) : dayjs();
            const today = dayjs();
            return date.isSame(today, 'day') ? (
              <View
                style={{
                  backgroundColor: 'black',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                  marginLeft: 8,
                  marginTop: 1,
                }}
              >
                <Text style={{ fontSize: 12, color: 'white', fontWeight: '500' }}>오늘</Text>
              </View>
            ) : null;
          })()}
        </View>
      </View>

      {selectedDateItems.length === 0 ? (
        <Text style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', paddingVertical: 20 }}>
          이 날의 아이템이 없어요
        </Text>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
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
