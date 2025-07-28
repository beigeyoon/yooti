import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { COMMON_STYLES, COLORS, SPACING } from '../../theme/styles';
import dayjs from 'dayjs';

interface WebDateInputProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  showDay?: boolean;
  mode?: 'date' | 'time';
}

export default function WebDateInput({
  label,
  value,
  placeholder,
  onPress,
  showDay = true,
  mode = 'date',
}: WebDateInputProps) {
  const getKoreanDay = (dateStr: string) => {
    if (!dateStr || !showDay) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = dayjs(dateStr);
    return days[d.day()];
  };

  const displayText = value ? (showDay ? `${value} (${getKoreanDay(value)})` : value) : placeholder;

  if (Platform.OS === 'web') {
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

  // 모바일에서는 기존 DateInput 사용
  return null;
}
