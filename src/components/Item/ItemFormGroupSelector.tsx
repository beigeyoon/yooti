import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import type { Group, GroupType, GroupLink } from '../../types/item';

interface ItemFormGroupSelectorProps {
  groups: Group[];
  selectedGroups: GroupLink[];
  onToggleGroup: (group: Group) => void;
  onChangeGroupType: (groupId: string, type: GroupType) => void;
  onChangeGroupOrder: (groupId: string, order: number | undefined) => void;
  showNewGroup: boolean;
  setShowNewGroup: (v: boolean) => void;
  newGroupName: string;
  setNewGroupName: (v: string) => void;
  newGroupDesc: string;
  setNewGroupDesc: (v: string) => void;
  onCreateGroup: () => void;
}

const GROUP_TYPE_OPTIONS = [
  { value: 'flow', label: '순서형' },
  { value: 'related', label: '연관형' },
  { value: 'dependency', label: '의존형' },
  { value: 'custom', label: '커스텀' },
];

export default function ItemFormGroupSelector({
  groups,
  selectedGroups,
  onToggleGroup,
  onChangeGroupType,
  onChangeGroupOrder,
  showNewGroup,
  setShowNewGroup,
  newGroupName,
  setNewGroupName,
  newGroupDesc,
  setNewGroupDesc,
  onCreateGroup,
}: ItemFormGroupSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupType, setNewGroupType] = useState('custom');

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
        그룹 할당
      </Text>
      {groups.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {groups.map(group => {
            const selected = selectedGroups.find(g => g.groupId === group.id);
            return (
              <TouchableOpacity
                key={group.id}
                onPress={() => onToggleGroup(group)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: selected ? '#000' : '#d1d5db',
                  backgroundColor: selected ? '#000' : 'white',
                }}
              >
                <Text style={{ color: selected ? 'white' : '#374151' }}>{group.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          marginBottom: 8,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#d1d5db',
          backgroundColor: '#f3f4f6',
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: '#374151', fontWeight: '600', fontSize: 15 }}>+ 새 그룹 만들기</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
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
                새 그룹 만들기
              </Text>
              <TextInput
                value={newGroupName}
                onChangeText={setNewGroupName}
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
                value={newGroupDesc}
                onChangeText={setNewGroupDesc}
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
              {/* 그룹 타입 선택 */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', marginBottom: 4 }}>그룹 타입</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {GROUP_TYPE_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => setNewGroupType(opt.value)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: newGroupType === opt.value ? '#000' : '#d1d5db',
                        backgroundColor: newGroupType === opt.value ? '#000' : 'white',
                        marginRight: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: newGroupType === opt.value ? 'white' : '#374151',
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
                  onPress={() => setModalVisible(false)}
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
                  onPress={() => {
                    onCreateGroup();
                    setModalVisible(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 8,
                    backgroundColor: '#d1d5db',
                  }}
                >
                  <Text style={{ color: '#374151', fontWeight: '600' }}>그룹 생성</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
