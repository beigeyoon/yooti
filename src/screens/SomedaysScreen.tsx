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
import { getTypeColor, getTypeLabel } from '../utils/itemUtils';
import { Item } from '../types/item';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 30;

interface SomedaysScreenProps {
  onEditItem?: (item: Item) => void;
}

export default function SomedaysScreen({ onEditItem }: SomedaysScreenProps) {
  const { items, deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

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

  const SwipeableItem = ({ item }: { item: Item }) => {
    const translateX = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, context: any) => {
        context.startX = translateX.value;
      },
      onActive: (event, context) => {
        const newTranslateX = context.startX + event.translationX;
        translateX.value = Math.min(0, Math.max(-120, newTranslateX));
      },
      onEnd: event => {
        if (event.translationX < -SWIPE_THRESHOLD) {
          translateX.value = -120;
        } else {
          translateX.value = 0;
        }
      },
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value }],
      };
    });

    const actionButtonsStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value + 120 }],
        opacity: translateX.value < -10 ? 1 : 0,
      };
    });

    return (
      <View style={{ marginBottom: 8 }}>
        {/* 액션 버튼들 (배경) */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              flexDirection: 'row',
              width: 120,
            },
            actionButtonsStyle,
          ]}
        >
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              width: 50,
              height: '100%',
            }}
          >
            <Ionicons name="create-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              width: 50,
              height: '100%',
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </Animated.View>

        {/* 메인 아이템 컨텐츠 */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: getTypeColor(item.type),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              },
              animatedStyle,
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  backgroundColor: getTypeColor(item.type),
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  {getTypeLabel(item.type)}
                </Text>
              </View>
              {item.checked && (
                <View
                  style={{
                    backgroundColor: '#10b981',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>완료</Text>
                </View>
              )}
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#111827',
                marginBottom: 4,
                // 할일과 반복이 체크된 경우 취소선과 회색 처리
                ...((item.type === 'todo' || item.type === 'routine') && item.checked
                  ? {
                      textDecorationLine: 'line-through',
                      color: '#9ca3af',
                    }
                  : {}),
              }}
            >
              {item.title}
            </Text>

            {item.note && (
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{item.note}</Text>
            )}

            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
              생성일: {new Date(item.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
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
        <SwipeableItem key={item.id} item={item} />
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
