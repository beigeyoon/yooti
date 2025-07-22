import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import type { GroupType } from '../../types/item';

interface GroupEditModalProps {
  visible: boolean;
  group: { id: string; title: string; description: string; type: GroupType } | null;
  onChange: (
    patch: Partial<{ id: string; title: string; description: string; type: GroupType }>,
  ) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function GroupEditModal({
  visible,
  group,
  onChange,
  onClose,
  onSave,
}: GroupEditModalProps) {
  if (!group) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '85%',
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>그룹 수정</Text>
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
            }}
          />
          {/* 타입 선택 */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {(['flow', 'related', 'dependency', 'custom'] as GroupType[]).map(typeOpt => (
              <TouchableOpacity
                key={typeOpt}
                onPress={() => onChange({ type: typeOpt })}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: group.type === typeOpt ? '#000' : '#d1d5db',
                  backgroundColor: group.type === typeOpt ? '#000' : 'white',
                }}
              >
                <Text style={{ color: group.type === typeOpt ? 'white' : '#374151' }}>
                  {typeOpt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, backgroundColor: '#e5e7eb', padding: 12, borderRadius: 8 }}
            >
              <Text style={{ textAlign: 'center', color: '#374151' }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSave}
              style={{ flex: 1, backgroundColor: '#2563eb', padding: 12, borderRadius: 8 }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
