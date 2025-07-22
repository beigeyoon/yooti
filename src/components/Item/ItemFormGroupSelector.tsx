import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
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
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>그룹 할당</Text>
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
        onPress={() => setShowNewGroup(!showNewGroup)}
        style={{ marginBottom: showNewGroup ? 8 : 0 }}
      >
        <Text style={{ color: '#2563eb', fontWeight: '600' }}>+ 새 그룹 만들기</Text>
      </TouchableOpacity>
      {showNewGroup && (
        <View style={{ marginBottom: 8 }}>
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
              marginBottom: 6,
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
              marginBottom: 6,
            }}
          />
          <TouchableOpacity
            onPress={onCreateGroup}
            style={{ backgroundColor: '#2563eb', padding: 10, borderRadius: 8 }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              그룹 생성
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
