import React from 'react';
import { View } from 'react-native';

interface PeriodBarProps {
  color: string;
}

export default function PeriodBar({ color }: PeriodBarProps) {
  return (
    <View
      style={{
        height: 3,
        backgroundColor: color,
        borderRadius: 0,
        marginVertical: 1,
        marginHorizontal: 0,
      }}
    />
  );
}
