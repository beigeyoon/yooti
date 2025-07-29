import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ItemForm from '../components/Item/ItemForm';
import DailyDetail from '../components/DailyDetail';
import CalendarHeader from '../components/Calendar/CalendarHeader';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import FloatingActionButton from '../components/Calendar/FloatingActionButton';
// import GlobalHeader from '../components/GlobalHeader';
import { Item } from '../types/item';
import { useTimeStore } from '../store/itemStore';
import { getCalendarItems, getTypeLabel } from '../utils/itemUtils';
import { getItemTypeColor as getTypeColor, getPeriodColor } from '../theme/colors';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { COMMON_STYLES, COLORS, SPACING } from '../theme/styles';

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);

const { width, height } = Dimensions.get('window');
const AVAILABLE_HEIGHT = height - 56 - 25 - 2;
const CELL_WIDTH = (width - 16) / 7;
const CELL_HEIGHT = typeof window !== 'undefined' ? CELL_WIDTH : CELL_WIDTH * 1.1; // 웹에서는 정사각형(1:1), 모바일에서는 1:1.1 비율
const CELL_SIZE = Math.min(CELL_WIDTH, AVAILABLE_HEIGHT / 4);

interface CalendarScreenProps {
  currentScreen: 'calendar' | 'today' | 'form' | 'somedays';
  selectedDate: string | null;
  onNavigateToToday: (date: string) => void;
  onNavigateToForm: (presetDate?: string) => void;
  onNavigateToEditForm: (item: Item) => void;
  onBackToCalendar: () => void;
  editingItem: Item | null;
  onNavigateToGroups?: () => void;
}

export default function CalendarScreen({
  currentScreen,
  selectedDate,
  onNavigateToToday,
  onNavigateToForm,
  onNavigateToEditForm,
  onBackToCalendar,
  editingItem,
  onNavigateToGroups,
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
      {/* <GlobalHeader title="캘린더" onNavigateToGroups={onNavigateToGroups} /> */}
      {/* 캘린더 */}
      <View style={{ paddingHorizontal: 8 }}>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => setCurrentDate(currentDate.subtract(1, 'month'))}
          onNextMonth={() => setCurrentDate(currentDate.add(1, 'month'))}
          CELL_WIDTH={CELL_WIDTH}
        />
        <CalendarGrid
          calendarDays={calendarDays}
          currentDate={currentDate}
          selectedCalendarDate={selectedCalendarDate}
          items={items}
          getItemsForDate={getItemsForDate}
          getPeriodItemsForDate={getPeriodItemsForDate}
          getWeekPeriodSlots={getWeekPeriodSlots}
          getTypeColor={getTypeColor}
          getPeriodColor={getPeriodColor}
          CELL_WIDTH={CELL_WIDTH}
          CELL_HEIGHT={CELL_HEIGHT}
          onSelectDate={setSelectedCalendarDate}
        />
      </View>

      {/* DailyDetail 영역 */}
      <DailyDetail selectedDate={selectedCalendarDate} onEditItem={onNavigateToEditForm} />

      <FloatingActionButton onPress={() => onNavigateToForm(selectedCalendarDate || undefined)} />
    </View>
  );
}
