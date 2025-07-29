import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import type { GroupType } from '../../types/item';
import { COMMON_STYLES, COLORS, SPACING } from '../../theme/styles';

const GROUP_TYPE_OPTIONS = [
  { value: 'flow', label: '순서형' },
  { value: 'related', label: '연관형' },
  { value: 'dependency', label: '의존형' },
  { value: 'custom', label: '커스텀' },
];

interface GroupEditModalProps {
  visible: boolean;
  group: { id?: string; title: string; description: string; type: GroupType } | null;
  onChange: (
    patch: Partial<{ id?: string; title: string; description: string; type: GroupType }>,
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
  isCreate?: boolean;
}

export default function GroupEditModal({
  visible,
  group,
  onChange,
  onClose,
  onSubmit,
  isCreate,
}: GroupEditModalProps) {
  if (!group) return null;
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, position: 'relative' }}>
        {/* dim 배경 */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        />
        {/* 모달 컨텐츠 */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 16,
              width: 320,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              {isCreate ? '새 그룹 만들기' : '그룹 수정'}
            </Text>
            <TextInput
              value={group.title}
              onChangeText={txt => onChange({ title: txt })}
              placeholder="그룹명"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 10,
                fontSize: 15,
                marginBottom: 8,
              }}
            />
            <TextInput
              value={group.description}
              onChangeText={txt => onChange({ description: txt })}
              placeholder="설명 (선택)"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 10,
                fontSize: 15,
                marginBottom: SPACING.lg,
              }}
            />
            <View style={[COMMON_STYLES.row, { gap: SPACING.md }]}>
              <TouchableOpacity
                onPress={onClose}
                style={[COMMON_STYLES.button, { flex: 1, backgroundColor: COLORS.border }]}
              >
                <Text style={[COMMON_STYLES.buttonText, { color: COLORS.secondary }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                style={[COMMON_STYLES.button, { flex: 1, backgroundColor: COLORS.primary }]}
              >
                <Text style={[COMMON_STYLES.buttonText, { color: COLORS.white }]}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
