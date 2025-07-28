import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import type { Group, GroupType, GroupLink } from '../../types/item';
import SelectableButton from '../common/SelectableButton';
import FormSection from '../common/FormSection';
import ModalContainer from '../common/ModalContainer';
import { COMMON_STYLES, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../theme/styles';

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
  const [modalVisible, setModalVisible] = useState(false);

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
      <ModalContainer visible={modalVisible} onClose={() => setModalVisible(false)} width={320}>
        <Text style={COMMON_STYLES.sectionTitle}>새 그룹 만들기</Text>
        <TextInput
          value={newGroupName}
          onChangeText={setNewGroupName}
          placeholder="그룹명"
          style={[COMMON_STYLES.input, { marginBottom: SPACING.sm }]}
        />
        <TextInput
          value={newGroupDesc}
          onChangeText={setNewGroupDesc}
          placeholder="설명 (선택)"
          style={[COMMON_STYLES.input, { marginBottom: SPACING.lg }]}
        />
        <View style={[COMMON_STYLES.row, { justifyContent: 'flex-end', gap: SPACING.sm }]}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={[COMMON_STYLES.button, { backgroundColor: COLORS.muted }]}
          >
            <Text style={[COMMON_STYLES.buttonText, { color: COLORS.secondary }]}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onCreateGroup();
              setModalVisible(false);
            }}
            style={[COMMON_STYLES.button, { backgroundColor: COLORS.border }]}
          >
            <Text style={[COMMON_STYLES.buttonText, { color: COLORS.secondary }]}>그룹 생성</Text>
          </TouchableOpacity>
        </View>
      </ModalContainer>
    </FormSection>
  );
}
