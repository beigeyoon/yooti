import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubItem } from '../../types/item';
import { COMMON_STYLES, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../theme/styles';

interface SubItemFormProps {
  subItems: SubItem[];
  onChange: (subItems: SubItem[]) => void;
  onParentCheckChange?: (checked: boolean) => void;
}

export default function SubItemForm({ subItems, onChange, onParentCheckChange }: SubItemFormProps) {
  const [newItemTitle, setNewItemTitle] = useState('');

  // 안전한 ID 생성 함수
  const generateSubItemId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `sub-${timestamp}-${random}`;
  };

  const addSubItem = () => {
    if (!newItemTitle.trim()) return;

    const newSubItem: SubItem = {
      id: generateSubItemId(),
      title: newItemTitle.trim(),
      checked: false,
      createdAt: new Date().toISOString(),
    };

    onChange([...subItems, newSubItem]);
    setNewItemTitle('');
  };

  const updateSubItem = (id: string, updates: Partial<SubItem>) => {
    const updated = subItems.map(item => (item.id === id ? { ...item, ...updates } : item));
    onChange(updated);
  };

  const deleteSubItem = (id: string) => {
    const filtered = subItems.filter(item => item.id !== id);
    onChange(filtered);
  };

  const toggleSubItem = (id: string) => {
    const updatedSubItems = subItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );

    // 모든 하위 항목이 체크되었는지 확인
    const allSubItemsChecked = updatedSubItems.every(subItem => subItem.checked);

    // 하위 항목 업데이트
    onChange(updatedSubItems);

    // 상위 항목 체크 상태 업데이트
    if (onParentCheckChange) {
      onParentCheckChange(allSubItemsChecked);
    }
  };

  return (
    <View>
      {/* 기존 항목들 */}
      <ScrollView style={{ maxHeight: 200 }}>
        {subItems.map((item, index) => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: SPACING.sm,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleSubItem(item.id)}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: item.checked ? COLORS.primary : COLORS.border,
                backgroundColor: item.checked ? COLORS.primary : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: SPACING.sm,
              }}
            >
              {item.checked && <Ionicons name="checkmark" size={14} color="white" />}
            </TouchableOpacity>

            <TextInput
              value={item.title}
              onChangeText={text => updateSubItem(item.id, { title: text })}
              style={{
                flex: 1,
                fontSize: FONT_SIZE.md,
                color: item.checked ? COLORS.tertiary : COLORS.secondary,
                textDecorationLine: item.checked ? 'line-through' : 'none',
              }}
              placeholder="항목 제목"
            />

            <TouchableOpacity
              onPress={() => deleteSubItem(item.id)}
              style={{ padding: SPACING.xs }}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 새 항목 추가 */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={newItemTitle}
          onChangeText={setNewItemTitle}
          placeholder="새 항목 추가"
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: '#ffffff',
            flex: 1,
            marginRight: SPACING.sm,
            height: 40,
          }}
          onSubmitEditing={addSubItem}
        />
        <TouchableOpacity
          onPress={addSubItem}
          style={{
            backgroundColor: COLORS.primary,
            padding: SPACING.sm,
            borderRadius: SPACING.sm,
          }}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
