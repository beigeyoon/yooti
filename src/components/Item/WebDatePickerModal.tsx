import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { COMMON_STYLES, COLORS, SPACING } from '../../theme/styles';

interface WebDatePickerModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  onConfirm: (value: string) => void;
  onCancel: () => void;
  currentValue?: string;
}

export default function WebDatePickerModal({
  visible,
  mode,
  onConfirm,
  onCancel,
  currentValue,
}: WebDatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(currentValue || '');

  // currentValue가 변경될 때 selectedDate 업데이트
  React.useEffect(() => {
    setSelectedDate(currentValue || '');
  }, [currentValue]);

  if (Platform.OS !== 'web') {
    return null;
  }

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  const formatDateForInput = (date: string) => {
    if (!date) return '';
    return date;
  };

  const formatTimeForInput = (time: string) => {
    if (!time) return '';
    return time;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: SPACING.xxl,
            borderRadius: SPACING.lg,
            width: 320,
            marginHorizontal: 20,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Text style={COMMON_STYLES.sectionTitle}>
            {mode === 'date' ? '날짜 선택' : '시간 선택'}
          </Text>

          <View style={{ marginVertical: SPACING.lg }}>
            {mode === 'date' ? (
              <input
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={e => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 16,
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <input
                type="time"
                value={formatTimeForInput(selectedDate)}
                onChange={e => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 16,
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </View>

          <View style={[COMMON_STYLES.row, { gap: SPACING.md }]}>
            <TouchableOpacity
              onPress={onCancel}
              style={[COMMON_STYLES.button, { flex: 1, backgroundColor: COLORS.border }]}
            >
              <Text style={[COMMON_STYLES.buttonText, { color: COLORS.secondary }]}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[COMMON_STYLES.button, { flex: 1, backgroundColor: COLORS.primary }]}
            >
              <Text style={[COMMON_STYLES.buttonText, { color: COLORS.white }]}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
