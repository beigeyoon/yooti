import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import type { GroupType } from '../../types/item';

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
                marginBottom: 8,
              }}
            />
            {/* 타입 선택 */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 4 }}>그룹 타입</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {GROUP_TYPE_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => onChange({ type: opt.value as GroupType })}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: group.type === opt.value ? '#000' : '#d1d5db',
                      backgroundColor: group.type === opt.value ? '#000' : 'white',
                      marginRight: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: group.type === opt.value ? 'white' : '#374151',
                        fontSize: 14,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  backgroundColor: '#e5e7eb',
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  backgroundColor: '#d1d5db',
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>
                  {isCreate ? '그룹 생성' : '저장'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
