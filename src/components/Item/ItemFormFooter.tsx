import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { COMMON_STYLES, COLORS, SPACING, FONT_WEIGHT } from '../../theme/styles';

interface ItemFormFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isEditMode?: boolean;
}

export default function ItemFormFooter({ onCancel, onSubmit, isEditMode }: ItemFormFooterProps) {
  return (
    <View
      style={[
        COMMON_STYLES.row,
        {
          backgroundColor: COLORS.white,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.lg,
          gap: SPACING.md,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onCancel}
        style={[COMMON_STYLES.button, { flex: 1, backgroundColor: COLORS.border }]}
      >
        <Text style={[COMMON_STYLES.buttonText, { color: COLORS.secondary }]}>취소</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSubmit}
        style={[COMMON_STYLES.button, { flex: 1, backgroundColor: COLORS.primary }]}
      >
        <Text style={[COMMON_STYLES.buttonText, { color: COLORS.white }]}>
          {isEditMode ? '수정' : '저장'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
