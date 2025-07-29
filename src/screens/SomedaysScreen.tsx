import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useTimeStore } from '../store/itemStore';
import { getTypeLabel } from '../utils/itemUtils';
import { getItemTypeColor as getTypeColor } from '../theme/colors';
import { Item } from '../types/item';
import ItemCard from '../components/Item/ItemCard';
import { useItemActions } from '../components/Item/useItemActions';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/common/EmptyState';
import { COMMON_STYLES, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../theme/styles';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 30;

interface SomedaysScreenProps {
  onEditItem?: (item: Item) => void;
}

export default function SomedaysScreen({ onEditItem }: SomedaysScreenProps) {
  const { items, groups, deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

  // 날짜가 설정되지 않은 아이템들 필터링 (Someday 아이템들)
  const somedayItems = items.filter(item => !item.startDate && !item.endDate);

  // 타입별로 그룹화
  const groupedItems = somedayItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, typeof items>,
  );

  const { handleDelete, handleToggleCheck, handleEdit, ConfirmModalComponent } =
    useItemActions(onEditItem);

  const renderTypeSection = (type: string, items: any[]) => (
    <View key={type} style={{ marginBottom: SPACING.xxl }}>
      <View style={[COMMON_STYLES.row, { marginBottom: SPACING.md }]}>
        <View
          style={{
            width: 4,
            height: 20,
            backgroundColor: getTypeColor(type),
            borderRadius: 2,
            marginRight: SPACING.sm,
          }}
        />
        <Text style={COMMON_STYLES.sectionTitle}>{getTypeLabel(type)}</Text>
        <Text style={[COMMON_STYLES.caption, { marginLeft: SPACING.sm }]}>({items.length})</Text>
      </View>
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleCheck={item.type === 'todo' || item.type === 'routine' ? handleEdit : undefined}
          getItemColor={item => getTypeColor(item.type)}
          groups={groups}
          showCheckbox={false}
        />
      ))}
    </View>
  );

  return (
    <View style={[COMMON_STYLES.container, { backgroundColor: COLORS.background }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SPACING.lg }}>
        {somedayItems.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="언젠가 할 일이 없습니다"
            subtitle="새로운 아이템을 만들 때 '언젠가'를 선택하면 여기에 표시됩니다"
          />
        ) : (
          Object.entries(groupedItems)
            .sort(([a], [b]) => {
              // 타입별 우선순위: 할일 > 이벤트 > 반복 > 기간 > 마감일
              const priority = { todo: 5, event: 4, routine: 3, period: 2, deadline: 1 };
              return (
                (priority[b as keyof typeof priority] || 0) -
                (priority[a as keyof typeof priority] || 0)
              );
            })
            .map(([type, items]) => renderTypeSection(type, items))
        )}
      </ScrollView>

      {/* 확인 모달 */}
      <ConfirmModalComponent />
    </View>
  );
}
