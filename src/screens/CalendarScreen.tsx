import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ItemForm from '../components/Item/ItemForm';

import DailyDetail from '../components/DailyDetail';
import { Item } from '../types/item';
import { useTimeStore } from '../store/itemStore';
import { getCalendarItems, getTypeColor, getTypeLabel, getPeriodColor } from '../utils/itemUtils';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);

const { width, height } = Dimensions.get('window');
const AVAILABLE_HEIGHT = height - 56 - 25 - 2;
const CELL_WIDTH = (width - 16) / 7;
const CELL_HEIGHT = CELL_WIDTH * 1.2; // 가로:세로 비율 1:1.2
const CELL_SIZE = Math.min(CELL_WIDTH, AVAILABLE_HEIGHT / 4);

interface CalendarScreenProps {
  currentScreen: 'calendar' | 'today' | 'form' | 'somedays';
  selectedDate: string | null;
  onNavigateToToday: (date: string) => void;
  onNavigateToForm: (presetDate?: string) => void;
  onNavigateToEditForm: (item: Item) => void;
  onBackToCalendar: () => void;
  editingItem: Item | null;
}

export default function CalendarScreen({
  currentScreen,
  selectedDate,
  onNavigateToToday,
  onNavigateToForm,
  onNavigateToEditForm,
  onBackToCalendar,
  editingItem,
}: CalendarScreenProps) {
  const { addItem, items, updateItem } = useTimeStore();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // 앱 시작시 오늘 날짜 선택
  useEffect(() => {
    setSelectedCalendarDate(dayjs().format('YYYY-MM-DD'));
  }, []);

  const handleSubmit = (itemData: Omit<Item, 'id' | 'createdAt'> | Item) => {
    if (editingItem) {
      // 수정 모드: 기존 아이템 업데이트
      const updatedItem = itemData as Item;
      const { updateItem } = useTimeStore.getState();
      updateItem(editingItem.id, updatedItem);
      console.log('아이템이 수정되었습니다:', updatedItem);
    } else {
      // 새 아이템 생성 모드
      const newItemData = itemData as Omit<Item, 'id' | 'createdAt'>;
      addItem(newItemData);
      console.log('새 아이템이 저장되었습니다:', newItemData);
    }
    onBackToCalendar();
  };

  const handleCancel = () => {
    onBackToCalendar();
  };

  // 캘린더 데이터 생성
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  };

  // 특정 날짜의 아이템들 가져오기 (기간형 제외)
  const getItemsForDate = (date: dayjs.Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    return items.filter(item => {
      // 기간형은 제외 (막대로 표시)
      if (item.type === 'period') return false;

      // 시작일이 해당 날짜인 경우
      if (item.startDate === dateStr) return true;
      // 종료일이 해당 날짜인 경우
      if (item.endDate === dateStr) return true;
      // 기간에 해당 날짜가 포함되는 경우
      if (item.startDate && item.endDate) {
        const start = dayjs(item.startDate);
        const end = dayjs(item.endDate);
        return date.isBetween(start, end, 'day', '[]'); // 양 끝 포함
      }
      return false;
    });
  };

  // 주별 기간형 아이템들의 고정 위치 계산
  const getWeekPeriodSlots = (weekStart: dayjs.Dayjs) => {
    const weekEnd = weekStart.add(6, 'day');
    const weekPeriodItems = items.filter(item => {
      if (item.type !== 'period' || !item.startDate || !item.endDate) return false;

      const start = dayjs(item.startDate);
      const end = dayjs(item.endDate);

      // 주와 겹치는 기간형 아이템들
      return (
        (start.isBefore(weekEnd) || start.isSame(weekEnd, 'day')) &&
        (end.isAfter(weekStart) || end.isSame(weekStart, 'day'))
      );
    });

    // 시작일 순서로 정렬
    const sortedItems = weekPeriodItems.sort((a, b) => {
      if (!a.startDate || !b.startDate) return 0;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    // 각 슬롯에 아이템 할당 (최대 3개)
    const slots: (Item | null)[] = [null, null, null];

    sortedItems.forEach(item => {
      // 빈 슬롯 찾기
      const emptySlotIndex = slots.findIndex(slot => slot === null);
      if (emptySlotIndex !== -1) {
        slots[emptySlotIndex] = item;
      }
    });

    return slots;
  };

  // 특정 날짜의 기간형 아이템들 가져오기 (고정 위치 포함)
  const getPeriodItemsForDate = (date: dayjs.Dayjs) => {
    const weekStart = date.startOf('week');
    const weekSlots = getWeekPeriodSlots(weekStart);
    const dateStr = date.format('YYYY-MM-DD');

    return weekSlots
      .filter(slot => slot !== null)
      .filter(item => {
        if (!item) return false;

        // 시작일이 해당 날짜인 경우
        if (item.startDate === dateStr) return true;
        // 종료일이 해당 날짜인 경우
        if (item.endDate === dateStr) return true;
        // 기간에 해당 날짜가 포함되는 경우
        if (item.startDate && item.endDate) {
          const start = dayjs(item.startDate);
          const end = dayjs(item.endDate);
          return date.isBetween(start, end, 'day', '[]'); // 양 끝 포함
        }
        return false;
      });
  };

  // 캘린더 헤더 (요일)
  const renderCalendarHeader = () => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return (
      <View style={{ flexDirection: 'row', marginBottom: 2 }}>
        {weekdays.map((day, index) => (
          <View
            key={day}
            style={{
              width: CELL_WIDTH,
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: index === 0 ? '#ef4444' : index === 6 ? '#000000' : '#374151',
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // 캘린더 셀
  const renderCalendarCell = (date: dayjs.Dayjs) => {
    const isCurrentMonth = date.month() === currentDate.month();
    const isToday = date.isSame(dayjs(), 'day');
    const isPastDate = date.isBefore(dayjs(), 'day');
    const isSelected = selectedCalendarDate === date.format('YYYY-MM-DD');
    const dateStr = date.format('YYYY-MM-DD');
    const dateItems = getItemsForDate(date);
    const periodItems = getPeriodItemsForDate(date);
    const totalItems = dateItems.length + periodItems.length;

    return (
      <TouchableOpacity
        key={date.format('YYYY-MM-DD')}
        onPress={() => setSelectedCalendarDate(date.format('YYYY-MM-DD'))}
        style={{
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          borderWidth: 0.5,
          borderColor: isSelected ? '#000000' : '#e5e7eb',
          backgroundColor: isSelected ? '#f3f4f6' : isToday ? '#e5e7eb' : 'white',
          paddingTop: 3,
          paddingBottom: 3,
          paddingLeft: 0,
          paddingRight: 0,
          opacity: isPastDate ? 0.5 : 1,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: isToday ? 'bold' : 'normal',
            color: isCurrentMonth ? '#111827' : '#9ca3af',
            textAlign: 'center',
            marginBottom: 2,
          }}
        >
          {date.date()}
        </Text>

        {/* 기간형 막대 표시 */}
        {(() => {
          const weekStart = date.startOf('week');
          const weekSlots = getWeekPeriodSlots(weekStart);
          const dateStr = date.format('YYYY-MM-DD');

          // 현재 날짜에 표시할 슬롯들
          const activeSlots = weekSlots.map(slot => {
            if (!slot) return null;

            // 해당 날짜에 이 아이템이 표시되어야 하는지 확인
            if (slot.startDate === dateStr || slot.endDate === dateStr) return slot;
            if (slot.startDate && slot.endDate) {
              const start = dayjs(slot.startDate);
              const end = dayjs(slot.endDate);
              if (date.isBetween(start, end, 'day', '[]')) return slot;
            }
            return null;
          });

          if (activeSlots.every(slot => slot === null)) return null;

          return (
            <View style={{ marginBottom: 1 }}>
              {activeSlots
                .filter(slot => slot !== null)
                .map((slot, index) => (
                  <View
                    key={slot!.id}
                    style={{
                      height: 3,
                      backgroundColor: getPeriodColor(slot!.id, slot!.endDate, items),
                      borderRadius: 0,
                      marginVertical: 1,
                      marginHorizontal: 0,
                    }}
                  />
                ))}
            </View>
          );
        })()}

        {/* 다른 아이템들 표시 */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {dateItems
            .sort((a, b) => {
              // 우선순위: 마감일 > 이벤트 > 반복 > 할일
              const priority = { deadline: 4, event: 3, routine: 2, todo: 1 };
              const aPriority = priority[a.type as keyof typeof priority] || 0;
              const bPriority = priority[b.type as keyof typeof priority] || 0;
              return bPriority - aPriority; // 내림차순 정렬
            })
            .slice(0, 3)
            .map(item => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 1,
                  paddingHorizontal: item.type === 'deadline' ? 0 : 2,
                }}
              >
                {/* 마감일은 블록형, 나머지는 동그라미 */}
                {item.type === 'deadline' ? (
                  <View
                    style={{
                      backgroundColor: getTypeColor(item.type),
                      paddingVertical: 1,
                      marginHorizontal: 0,
                      paddingHorizontal: 4,
                      borderRadius: 0,
                      flex: 1,
                      marginTop: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 8,
                        fontWeight: '600',
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: getTypeColor(item.type),
                        marginRight: 4,
                      }}
                    />
                    <Text
                      style={{
                        color: '#374151',
                        fontSize: 8,
                        fontWeight: '600',
                        flex: 1,
                        // 할일과 반복이 체크된 경우 취소선
                        ...((item.type === 'todo' || item.type === 'routine') && item.checked
                          ? {
                              textDecorationLine: 'line-through',
                              color: '#9ca3af',
                            }
                          : {}),
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </>
                )}
              </View>
            ))}
          {totalItems > 3 && (
            <Text
              style={{
                fontSize: 8,
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              +{totalItems - 3}
            </Text>
          )}
        </ScrollView>
      </TouchableOpacity>
    );
  };

  // 아이템 생성/수정 폼 표시
  if (currentScreen === 'form') {
    return (
      <ItemForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        editingItem={editingItem}
        presetDate={selectedCalendarDate || undefined}
      />
    );
  }

  // 캘린더 메인 화면
  const calendarDays = generateCalendarDays();

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* 캘린더 네비게이션 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}
      >
        <TouchableOpacity
          onPress={() => setCurrentDate(currentDate.subtract(1, 'month'))}
          style={{ padding: 6 }}
        >
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
          {currentDate.format('YYYY년 M월')}
        </Text>

        <TouchableOpacity
          onPress={() => setCurrentDate(currentDate.add(1, 'month'))}
          style={{ padding: 6 }}
        >
          <Ionicons name="chevron-forward" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 캘린더 */}
      <View style={{ paddingHorizontal: 8 }}>
        {renderCalendarHeader()}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {calendarDays.map(date => renderCalendarCell(date))}
        </View>
      </View>

      {/* DailyDetail 영역 */}
      <DailyDetail selectedDate={selectedCalendarDate} onEditItem={onNavigateToEditForm} />

      {/* 플로팅 새 아이템 버튼 */}
      <TouchableOpacity
        onPress={() => onNavigateToForm(selectedCalendarDate || undefined)}
        style={{
          position: 'absolute',
          right: 24,
          bottom: 40,
          backgroundColor: '#000000',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
