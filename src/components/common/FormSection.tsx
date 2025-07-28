import React from 'react';
import { View, Text } from 'react-native';
import { COMMON_STYLES } from '../../theme/styles';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  marginTop?: number;
}

export default function FormSection({ title, children, marginTop }: FormSectionProps) {
  return (
    <View style={[COMMON_STYLES.section, marginTop ? { marginTop } : undefined]}>
      <Text style={COMMON_STYLES.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
