import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../theme/styles';

interface ItemCardCheckboxProps {
  checked: boolean;
  color: string;
  onPress: () => void;
}

export default function ItemCardCheckbox({ checked, color, onPress }: ItemCardCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginRight: SPACING.md,
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: checked ? color : COLORS.border,
        backgroundColor: checked ? color : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {checked && <Ionicons name="checkmark" size={14} color="white" />}
    </TouchableOpacity>
  );
}
