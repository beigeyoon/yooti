import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Item } from '../types/item';
import { useTimeStore } from '../store/itemStore';
import { getItemsForDateSorted, sortPeriodItemsByStartDate } from '../utils/itemUtils';
import { getItemTypeColor as getTypeColor, getPeriodColor } from '../theme/colors';
import dayjs from 'dayjs';
import ItemCard from './Item/ItemCard';
import { useItemActions } from './Item/useItemActions';
import EmptyState from './common/EmptyState';
import { COMMON_STYLES, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../theme/styles';

interface DailyDetailProps {
  selectedDate: string | null;
  onEditItem?: (item: Item) => void;
}

export default function DailyDetail({ selectedDate, onEditItem }: DailyDetailProps) {
  const { items, groups, deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

  const { handleDelete, handleToggleCheck, handleEdit, ConfirmModalComponent } =
    useItemActions(onEditItem);

  const handleToggleSubItem = (itemId: string, subItemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.subItems) {
      const updatedSubItems = item.subItems.map(subItem =>
        subItem.id === subItemId ? { ...subItem, checked: !subItem.checked } : subItem,
      );

      // 모든 하위 항목이 체크되었는지 확인
      const allSubItemsChecked = updatedSubItems.every(subItem => subItem.checked);

      // 모든 하위 항목이 체크된 경우에만 상위 항목을 체크
      const updatedItem = {
        ...item,
        subItems: updatedSubItems,
        checked: allSubItemsChecked ? true : item.checked, // 기존 체크 상태 유지
      };

      updateItem(itemId, updatedItem);
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
    <View style={[COMMON_STYLES.container, { backgroundColor: COLORS.white, padding: SPACING.lg }]}>
      {/* 제목 */}
      <View style={[COMMON_STYLES.rowSpaceBetween]}>
        <Text style={COMMON_STYLES.title}>
          {selectedDate ? dayjs(selectedDate).format('M월 D일') : '오늘'}
        </Text>
        <Text style={COMMON_STYLES.caption}>{selectedDateItems.length}개의 아이템</Text>
      </View>

      {/* 아이템 목록 */}
      {selectedDateItems.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="이 날의 아이템이 없어요"
          subtitle="새로운 아이템을 추가해보세요"
        />
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
              onToggleSubItem={handleToggleSubItem}
              getItemColor={getItemColor}
              groups={groups}
            />
          ))}
        </ScrollView>
      )}

      {/* 확인 모달 */}
      <ConfirmModalComponent />
    </View>
  );
}
