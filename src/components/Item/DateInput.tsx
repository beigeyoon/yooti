import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import dayjs from 'dayjs';
import { DATE_INPUT_STYLES, DATE_INPUT_WEB_STYLES } from '../../theme/styles';

interface DateInputProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  onChange?: (value: string) => void;
  showDay?: boolean;
}

export default function DateInput({
  label,
  value,
  placeholder,
  onPress,
  onChange,
  showDay = true,
}: DateInputProps) {
  const getKoreanDay = (dateStr: string) => {
    if (!dateStr || !showDay) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = dayjs(dateStr);
    return days[d.day()];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = dayjs(dateStr);
    const year = d.year();
    const month = d.month() + 1;
    const day = d.date();
    const dayName = getKoreanDay(dateStr);
    return `${year}. ${month}. ${day}. (${dayName})`;
  };

  const displayText = value ? (showDay ? formatDate(value) : value) : placeholder;

  // 웹용 스타일 (동적 값 포함)
  const getWebInputStyle = () => ({
    ...DATE_INPUT_WEB_STYLES.webInput,
    paddingRight: value ? '40px' : '12px',
  });

  // 웹용 렌더링
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        {showDay ? (
          <input
            type="date"
            value={value || ''}
            onChange={e => {
              if (e.target.value && onChange) {
                onChange(e.target.value);
              }
            }}
            style={getWebInputStyle()}
          />
        ) : (
          <input
            type="time"
            value={value || ''}
            onChange={e => {
              if (e.target.value && onChange) {
                onChange(e.target.value);
              }
            }}
            style={getWebInputStyle()}
          />
        )}

        {/* Placeholder 텍스트 */}
        {!value && (
          <Text
            numberOfLines={1}
            style={[DATE_INPUT_WEB_STYLES.webTextOverlay, { color: '#9ca3af' }]}
          >
            {placeholder}
          </Text>
        )}

        {/* 선택된 값 텍스트 */}
        {value && showDay && (
          <Text
            numberOfLines={1}
            style={[DATE_INPUT_WEB_STYLES.webTextOverlay, { color: '#374151' }]}
          >
            {formatDate(value)}
          </Text>
        )}

        {value && !showDay && (
          <Text
            numberOfLines={1}
            style={[DATE_INPUT_WEB_STYLES.webTextOverlay, { color: '#374151' }]}
          >
            {value}
          </Text>
        )}

        {/* X 버튼 */}
        {value && (
          <TouchableOpacity
            onPress={() => onChange && onChange('')}
            style={DATE_INPUT_STYLES.appXButton}
          >
            <Text style={DATE_INPUT_WEB_STYLES.webXButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // 앱용 렌더링
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          backgroundColor: '#f3f4f6',
          padding: 10,
          paddingRight: value ? 40 : 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#d1d5db',
        }}
      >
        <Text style={{ color: '#374151', textAlign: 'center', lineHeight: 20 }}>{displayText}</Text>
      </TouchableOpacity>

      {/* X 버튼 */}
      {value && (
        <TouchableOpacity
          onPress={() => onChange && onChange('')}
          style={DATE_INPUT_STYLES.appXButton}
        >
          <Text style={DATE_INPUT_STYLES.appXButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
