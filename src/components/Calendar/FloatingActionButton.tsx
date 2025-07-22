import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        right: 24,
        bottom: 40,
        backgroundColor: '#000000',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={32} color="white" />
    </TouchableOpacity>
  );
}
