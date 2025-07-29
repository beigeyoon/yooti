import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Group, GroupType, GroupLink } from '../../types/item';
import SelectableButton from '../common/SelectableButton';
import FormSection from '../common/FormSection';
import GroupEditModal from '../Group/GroupEditModal';
import { COMMON_STYLES, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../theme/styles';

interface ItemFormGroupSelectorProps {
  groups: Group[];
  selectedGroups: GroupLink[];
  onToggleGroup: (group: Group) => void;
  onChangeGroupType: (groupId: string, type: GroupType) => void;
  onChangeGroupOrder: (groupId: string, order: number | undefined) => void;
  onCreateGroup: (group: { title: string; description: string; type: GroupType }) => void;
}

export default function ItemFormGroupSelector({
  groups,
  selectedGroups,
  onToggleGroup,
  onChangeGroupType,
  onChangeGroupOrder,
  onCreateGroup,
}: ItemFormGroupSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroup, setNewGroup] = useState({
    title: '',
    description: '',
    type: 'related' as GroupType,
  });

  return (
    <FormSection title="그룹 할당">
      {groups.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.sm,
            marginBottom: SPACING.sm,
          }}
        >
          {groups.map(group => {
            const selected = selectedGroups.find(g => g.groupId === group.id);
            return (
              <SelectableButton
                key={group.id}
                label={group.title}
                value={group.id}
                isSelected={!!selected}
                onPress={() => onToggleGroup(group)}
              />
            );
          })}
        </View>
      )}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          COMMON_STYLES.button,
          COMMON_STYLES.buttonSecondary,
          {
            marginBottom: SPACING.sm,
            alignSelf: 'flex-start',
            backgroundColor: COLORS.inputBackground,
          },
        ]}
      >
        <Text style={[COMMON_STYLES.buttonText, COMMON_STYLES.buttonTextSecondary]}>
          + 새 그룹 만들기
        </Text>
      </TouchableOpacity>
      <GroupEditModal
        visible={modalVisible}
        group={newGroup}
        isCreate
        onChange={patch => setNewGroup(prev => ({ ...prev, ...patch }))}
        onClose={() => setModalVisible(false)}
        onSubmit={() => {
          onCreateGroup(newGroup);
          setModalVisible(false);
          setNewGroup({ title: '', description: '', type: 'related' });
        }}
      />
    </FormSection>
  );
}
