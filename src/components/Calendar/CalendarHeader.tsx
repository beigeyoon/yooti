import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface CalendarHeaderProps {
  currentDate: dayjs.Dayjs;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  CELL_WIDTH: number;
}

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  CELL_WIDTH,
}: CalendarHeaderProps) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <>
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
        <TouchableOpacity onPress={onPrevMonth} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
          {currentDate.format('YYYY년 M월')}
        </Text>
        <TouchableOpacity onPress={onNextMonth} style={{ padding: 6 }}>
          <Ionicons name="chevron-forward" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 0 }}>
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
    </>
  );
}
