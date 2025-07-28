import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMMON_STYLES, COLORS } from '../../theme/styles';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  iconSize?: number;
  iconColor?: string;
}

export default function EmptyState({
  icon = 'calendar-outline',
  title,
  subtitle,
  iconSize = 64,
  iconColor = COLORS.border,
}: EmptyStateProps) {
  return (
    <View style={COMMON_STYLES.emptyState}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={COMMON_STYLES.emptyStateText}>{title}</Text>
      {subtitle && <Text style={COMMON_STYLES.emptyStateSubtext}>{subtitle}</Text>}
    </View>
  );
}
