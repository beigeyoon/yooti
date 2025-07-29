import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { Item } from '../../types/item';
import PeriodBar from './PeriodBar';

interface CalendarCellProps {
  date: dayjs.Dayjs;
  currentDate: dayjs.Dayjs;
  selectedCalendarDate: string | null;
  items: Item[];
  getItemsForDate: (date: dayjs.Dayjs) => Item[];
  getPeriodItemsForDate: (date: dayjs.Dayjs) => Item[];
  getWeekPeriodSlots: (weekStart: dayjs.Dayjs) => (Item | null)[];
  getTypeColor: (type: string) => string;
  getPeriodColor: (id: string, endDate?: string, items?: Item[]) => string;
  CELL_WIDTH: number;
  CELL_HEIGHT: number;
  onSelectDate: (date: string) => void;
}

export default function CalendarCell({
  date,
  currentDate,
  selectedCalendarDate,
  items,
  getItemsForDate,
  getPeriodItemsForDate,
  getWeekPeriodSlots,
  getTypeColor,
  getPeriodColor,
  CELL_WIDTH,
  CELL_HEIGHT,
  onSelectDate,
}: CalendarCellProps) {
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
      onPress={() => onSelectDate(date.format('YYYY-MM-DD'))}
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
        const activeSlots = weekSlots.map(slot => {
          if (!slot) return null;
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
                <PeriodBar key={slot!.id} color={getPeriodColor(slot!.id, slot!.endDate, items)} />
              ))}
          </View>
        );
      })()}
      {/* 다른 아이템들 표시 */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {dateItems
          .sort((a, b) => {
            const priority = { deadline: 4, event: 3, routine: 2, todo: 1 };
            const aPriority = priority[a.type as keyof typeof priority] || 0;
            const bPriority = priority[b.type as keyof typeof priority] || 0;
            return bPriority - aPriority;
          })
          .slice(0, 3)
          .map(item => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 1,
                paddingHorizontal: 2,
              }}
            >
              {/* 모든 타입(기간형 제외) 동그라미 + 타이틀 */}
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
}
