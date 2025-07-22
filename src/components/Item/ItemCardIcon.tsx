import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ItemCardIconProps {
  type: string;
  checked?: boolean;
}

export default function ItemCardIcon({ type, checked }: ItemCardIconProps) {
  let name: any = 'ellipse-outline';
  let color = '#9ca3af';
  if (type === 'todo') {
    name = 'list-outline';
    color = '#3b82f6';
  } else if (type === 'routine') {
    name = 'repeat-outline';
    color = '#8b5cf6';
  } else if (type === 'event') {
    name = 'time-outline';
    color = '#f97316';
  } else if (type === 'deadline') {
    name = 'alert-circle-outline';
    color = '#ec4899';
  } else if (type === 'period') {
    name = 'calendar-outline';
    color = '#06b6d4';
  }
  if ((type === 'todo' || type === 'routine') && checked) {
    color = '#9ca3af';
  }
  return <Ionicons name={name} size={20} color={color} style={{ marginRight: 10 }} />;
}
