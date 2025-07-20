import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../types/item';
import { useTimeStore } from '../store/itemStore';
import {
  getItemsForDateSorted,
  getTypeColor,
  getTypeLabel,
  getPeriodColor,
  sortPeriodItemsByStartDate,
} from '../utils/itemUtils';
import dayjs from 'dayjs';

interface DailyDetailProps {
  selectedDate: string | null;
  onEditItem?: (item: Item) => void;
}

export default function DailyDetail({ selectedDate, onEditItem }: DailyDetailProps) {
  const { items, deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();

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
            <Swipeable
              key={item.id}
              renderRightActions={() => (
                <View style={{ flexDirection: 'row' }}>
                  {/* 수정 버튼 */}
                  <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    style={{
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 50,
                      height: 'auto',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#6b7280" />
                  </TouchableOpacity>

                  {/* 삭제 버튼 */}
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    style={{
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 50,
                      height: 'auto',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              )}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: getItemColor(item),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                  // 마감일/기간은 띠 형태로 변경
                  ...(item.type === 'deadline' || item.type === 'period'
                    ? {
                        borderRadius: 4,
                        backgroundColor: getItemColor(item) + '10',
                        borderLeftWidth: 0,
                        shadowOpacity: 0.05,
                        elevation: 1,
                      }
                    : {}),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  {/* 할일과 반복인 경우 체크박스 표시 */}
                  {(item.type === 'todo' || item.type === 'routine') && (
                    <TouchableOpacity
                      onPress={() => handleToggleCheck(item)}
                      style={{
                        marginRight: 12,
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: item.checked ? getItemColor(item) : '#d1d5db',
                        backgroundColor: item.checked ? getItemColor(item) : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {item.checked && <Ionicons name="checkmark" size={14} color="white" />}
                    </TouchableOpacity>
                  )}

                  {/* 마감일인 경우 느낌표 아이콘 표시 */}
                  {item.type === 'deadline' && (
                    <View
                      style={{
                        marginRight: 8,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: getItemColor(item),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>!</Text>
                    </View>
                  )}

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#111827',
                      flex: 1,
                      // 할일과 반복이 체크된 경우 취소선과 회색 처리
                      ...((item.type === 'todo' || item.type === 'routine') && item.checked
                        ? {
                            textDecorationLine: 'line-through',
                            color: '#9ca3af',
                          }
                        : {}),
                      // 마감일/기간은 더 진한 색상
                      ...(item.type === 'deadline' || item.type === 'period'
                        ? { color: getItemColor(item) }
                        : {}),
                    }}
                  >
                    {item.title}
                    {/* 이벤트에 시간 정보 표시 */}
                    {item.type === 'event' && (item.startTime || item.endTime) && (
                      <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: 'normal' }}>
                        {item.startTime && item.endTime
                          ? ` (${item.startTime} - ${item.endTime})`
                          : item.startTime
                            ? ` (${item.startTime})`
                            : ` (${item.endTime})`}
                      </Text>
                    )}
                  </Text>
                  <View
                    style={{
                      backgroundColor: getItemColor(item),
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10 }}>{getTypeLabel(item.type)}</Text>
                  </View>
                </View>
                {item.note && (
                  <Text
                    style={{
                      color: '#6b7280',
                      fontSize: 12,
                      // 마감일/기간은 더 작은 폰트
                      ...(item.type === 'deadline' || item.type === 'period'
                        ? { fontSize: 11 }
                        : {}),
                    }}
                    numberOfLines={2}
                  >
                    {item.note}
                  </Text>
                )}
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
