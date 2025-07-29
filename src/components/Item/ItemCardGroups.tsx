import React from 'react';
import { View, Text } from 'react-native';
import { Group, GroupLink } from '../../types/item';
import { COLORS, SPACING, FONT_SIZE } from '../../theme/styles';

interface ItemCardGroupsProps {
  itemGroups?: GroupLink[];
  allGroups?: Group[];
}

export default function ItemCardGroups({ itemGroups, allGroups }: ItemCardGroupsProps) {
  if (!itemGroups || itemGroups.length === 0) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: SPACING.xs,
        marginLeft: SPACING.sm,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {itemGroups.slice(0, 2).map(g => {
        const groupName = (allGroups || []).find(gr => gr.id === g.groupId)?.title || '그룹';
        return (
          <View
            key={g.groupId}
            style={{
              backgroundColor: '#e0e7ef',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: SPACING.sm,
              minWidth: 24,
            }}
          >
            <Text
              style={{
                color: COLORS.secondary,
                fontSize: FONT_SIZE.xs,
                lineHeight: 14,
                textAlignVertical: 'center',
              }}
              numberOfLines={1}
            >
              {groupName}
            </Text>
          </View>
        );
      })}
      {itemGroups.length > 2 && (
        <View
          style={{
            backgroundColor: '#e0e7ef',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: SPACING.sm,
            minWidth: 24,
          }}
        >
          <Text
            style={{
              color: COLORS.secondary,
              fontSize: FONT_SIZE.xs,
              lineHeight: 14,
              textAlignVertical: 'center',
            }}
          >
            +{itemGroups.length - 2}
          </Text>
        </View>
      )}
    </View>
  );
}
