import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createButtonStyle, createButtonTextStyle } from '../../theme/styles';

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
    <TouchableOpacity key={value} onPress={onPress} style={createButtonStyle(isSelected)}>
      <Text style={createButtonTextStyle(isSelected)}>{label}</Text>
    </TouchableOpacity>
  );
}
