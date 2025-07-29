import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createChipButtonStyle, createChipButtonTextStyle } from '../../theme/styles';

interface SelectableButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function SelectableButton({
  label,
  value,
  isSelected,
  onPress,
}: SelectableButtonProps) {
  return (
    <TouchableOpacity key={value} onPress={onPress} style={createChipButtonStyle(isSelected)}>
      <Text style={createChipButtonTextStyle(isSelected)}>{label}</Text>
    </TouchableOpacity>
  );
}
