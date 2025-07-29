import React from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';
import { Item } from '../../types/item';
import CalendarCell from './CalendarCell';
import { Platform } from 'react-native';

interface CalendarGridProps {
  calendarDays: dayjs.Dayjs[];
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

export default function CalendarGrid({
  calendarDays,
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
}: CalendarGridProps) {
  // 7일씩 그룹화
  const weekGroups = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weekGroups.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View style={{ flexDirection: 'column' }}>
      {weekGroups.map((week, weekIndex) => (
        <View
          key={weekIndex}
          style={[
            Platform.OS === 'web'
              ? {
                  flexDirection: 'row',
                  width: '100%',
                  maxWidth: '100%',
                }
              : {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                },
          ]}
        >
          {week.map(date => (
            <CalendarCell
              key={date.format('YYYY-MM-DD')}
              date={date}
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
              onSelectDate={onSelectDate}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
