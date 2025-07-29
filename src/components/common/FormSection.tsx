import React from 'react';
import { View, Text } from 'react-native';
import { COMMON_STYLES, SPACING } from '../../theme/styles';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  marginTop?: number;
  isFirstSection?: boolean;
}

export default function FormSection({
  title,
  children,
  marginTop,
  isFirstSection,
}: FormSectionProps) {
  return (
    <View
      style={[
        isFirstSection ? { marginTop: 0 } : COMMON_STYLES.section,
        marginTop ? { marginTop } : undefined,
      ]}
    >
      <Text style={COMMON_STYLES.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
