import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

interface DateInputProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  showDay?: boolean;
}

export default function DateInput({
  label,
  value,
  placeholder,
  onPress,
  showDay = true,
}: DateInputProps) {
  const getKoreanDay = (dateStr: string) => {
    if (!dateStr || !showDay) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = dayjs(dateStr);
    return days[d.day()];
  };

  const displayText = value ? (showDay ? `${value} (${getKoreanDay(value)})` : value) : placeholder;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
      }}
    >
      <Text style={{ color: '#374151', textAlign: 'center', lineHeight: 20 }}>{displayText}</Text>
    </TouchableOpacity>
  );
}
