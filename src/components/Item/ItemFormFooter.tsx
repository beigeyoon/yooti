import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface ItemFormFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isEditMode?: boolean;
}

export default function ItemFormFooter({ onCancel, onSubmit, isEditMode }: ItemFormFooterProps) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      <TouchableOpacity
        onPress={onCancel}
        style={{ flex: 1, backgroundColor: '#d1d5db', paddingVertical: 12, borderRadius: 8 }}
      >
        <Text style={{ textAlign: 'center', color: '#374151', fontWeight: '600' }}>취소</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSubmit}
        style={{ flex: 1, backgroundColor: '#000000', paddingVertical: 12, borderRadius: 8 }}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>
          {isEditMode ? '수정' : '저장'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
