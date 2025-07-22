import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { useTimeStore } from '../store/itemStore';
import { getTypeLabel } from '../utils/itemUtils';
import { getItemTypeColor as getTypeColor } from '../theme/colors';
import { Item } from '../types/item';
import ItemCard from '../components/Item/ItemCard';

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

  const handleEdit = (item: Item) => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const handleDelete = (item: Item) => {
    // 반복 아이템인 경우 선택 옵션 제공
    if (item.type === 'routine' && item.routineGroupId) {
      Alert.alert('반복 아이템 삭제', `"${item.title}"을(를) 삭제하시겠습니까?`, [
        { text: '취소', style: 'cancel' },
        {
          text: '이 날짜만',
          style: 'default',
          onPress: () => {
            deleteItem(item.id);
            Alert.alert('완료', '아이템이 삭제되었습니다.');
          },
        },
        {
          text: '전체 삭제',
          style: 'destructive',
          onPress: () => {
            deleteRoutineGroup(item.routineGroupId!);
            Alert.alert('완료', '반복 아이템 전체가 삭제되었습니다.');
          },
        },
      ]);
    } else {
      // 일반 아이템은 기존 로직
      Alert.alert('아이템 삭제', `"${item.title}"을(를) 삭제하시겠습니까?`, [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            Alert.alert('완료', '아이템이 삭제되었습니다.');
          },
        },
      ]);
    }
  };

  const renderTypeSection = (type: string, items: any[]) => (
    <View key={type} style={{ marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 4,
            height: 20,
            backgroundColor: getTypeColor(type),
            borderRadius: 2,
            marginRight: 8,
          }}
        />
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
          {getTypeLabel(type)}
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginLeft: 8 }}>({items.length})</Text>
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
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {somedayItems.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60,
            }}
          >
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={{ fontSize: 18, color: '#6b7280', marginTop: 16, textAlign: 'center' }}>
              언젠가 할 일이 없습니다
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
              새로운 아이템을 만들 때 '언젠가'를 선택하면{'\n'}여기에 표시됩니다
            </Text>
          </View>
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
    </View>
  );
}
