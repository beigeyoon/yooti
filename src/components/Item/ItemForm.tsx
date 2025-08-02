import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Item, ItemType, RepeatCycle } from '../../types/item';
import { useTimeStore } from '../../store/itemStore';
import { Group, GroupType, GroupLink } from '../../types/item';

import ItemFormFields from './ItemFormFields';
import ItemFormFooter from './ItemFormFooter';
import WebDatePickerModal from './WebDatePickerModal';
import SubItemForm from './SubItemForm';
import { COMMON_STYLES, COLORS, SPACING } from '../../theme/styles';

interface ItemFormProps {
  onSubmit: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  editingItem?: Item | null;
  presetDate?: string;
}

const itemTypes: { value: ItemType; label: string }[] = [
  { value: 'todo', label: '할 일' },
  { value: 'event', label: '이벤트' },
  { value: 'routine', label: '반복' },
  { value: 'period', label: '기간' },
  { value: 'deadline', label: '마감일' },
];

const repeatCycles: { value: RepeatCycle; label: string }[] = [
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
  { value: 'yearly', label: '매년' },
];

export default function ItemForm({ onSubmit, onCancel, editingItem, presetDate }: ItemFormProps) {
  const [title, setTitle] = useState(editingItem?.title || '');
  const [type, setType] = useState<ItemType>(editingItem?.type || 'todo');
  const [startDate, setStartDate] = useState<string>(editingItem?.startDate || '');
  const [endDate, setEndDate] = useState<string>(editingItem?.endDate || '');
  const [startTime, setStartTime] = useState<string>(editingItem?.startTime || '');
  const [endTime, setEndTime] = useState<string>(editingItem?.endTime || '');
  const [repeat, setRepeat] = useState<RepeatCycle | undefined>(editingItem?.repeat);
  const [checked, setChecked] = useState(editingItem?.checked || false);
  const [subItems, setSubItems] = useState(editingItem?.subItems || []);
  const [note, setNote] = useState(editingItem?.note || '');
  const [isSomeday, setIsSomeday] = useState(false);

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Web date picker states
  const [showWebStartDatePicker, setShowWebStartDatePicker] = useState(false);
  const [showWebEndDatePicker, setShowWebEndDatePicker] = useState(false);
  const [showWebStartTimePicker, setShowWebStartTimePicker] = useState(false);
  const [showWebEndTimePicker, setShowWebEndTimePicker] = useState(false);

  const { groups, addGroup } = useTimeStore();
  // 여러 그룹 선택 및 타입/순서 지정
  const [selectedGroups, setSelectedGroups] = useState<GroupLink[]>([]);

  useEffect(() => {
    if (editingItem?.groups) {
      setSelectedGroups(editingItem.groups);
    }
  }, [editingItem]);

  // 타입이 변경될 때 적절한 날짜 설정
  useEffect(() => {
    if (presetDate && !editingItem) {
      if (type === 'todo') {
        // 할일: endDate(완료 예정일)에 설정
        setEndDate(presetDate);
        setStartDate('');
      } else {
        // 다른 타입: startDate에 설정
        setStartDate(presetDate);
        setEndDate('');
      }
    }
  }, [type, presetDate, editingItem]);

  // 웹용 알림 함수
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showAlert('오류', '제목을 입력해주세요.');
      return;
    }

    // 언젠가가 아닌 경우에만 날짜 validation 적용
    if (!isSomeday) {
      // 할일: 완료예정일 필수
      if (type === 'todo' && !endDate) {
        showAlert('오류', '할일은 완료예정일을 반드시 선택해야 합니다.');
        return;
      }

      // 이벤트: 시작일 필수
      if (type === 'event' && !startDate) {
        showAlert('오류', '이벤트는 시작일을 반드시 선택해야 합니다.');
        return;
      }

      // 반복: 시작일 필수
      if (type === 'routine' && !startDate) {
        showAlert('오류', '반복은 시작일을 반드시 선택해야 합니다.');
        return;
      }

      // 기간: 시작일, 종료일 필수
      if (type === 'period') {
        if (!startDate) {
          showAlert('오류', '기간은 시작일을 반드시 선택해야 합니다.');
          return;
        }
        if (!endDate) {
          showAlert('오류', '기간은 종료일을 반드시 선택해야 합니다.');
          return;
        }
      }

      // 마감일: 마감일 필수
      if (type === 'deadline' && !endDate) {
        showAlert('오류', '마감일은 마감일을 반드시 선택해야 합니다.');
        return;
      }
    }

    // GroupLink 생성 (선택된 그룹이 있을 때만)
    const groupLinks = selectedGroups.length > 0 ? selectedGroups : undefined;

    if (editingItem) {
      // 수정 모드: 기존 아이템 업데이트
      const updatedItem: Item = {
        ...editingItem,
        title: title.trim(),
        type,
        startDate: isSomeday ? undefined : startDate || undefined,
        endDate: isSomeday ? undefined : endDate || undefined,
        startTime: isSomeday ? undefined : startTime || undefined,
        endTime: isSomeday ? undefined : endTime || undefined,
        repeat,
        checked,
        subItems: subItems.length > 0 ? subItems : undefined,
        note: note.trim() || undefined,
        groups: groupLinks,
      };
      onSubmit(updatedItem as any);
    } else {
      // 새 아이템 생성 모드
      const itemData: Omit<Item, 'id' | 'createdAt'> = {
        title: title.trim(),
        type,
        startDate: isSomeday ? undefined : startDate || undefined,
        endDate: isSomeday ? undefined : endDate || undefined,
        startTime: isSomeday ? undefined : startTime || undefined,
        endTime: isSomeday ? undefined : endTime || undefined,
        repeat,
        checked,
        subItems: subItems.length > 0 ? subItems : undefined,
        note: note.trim() || undefined,
        groups: groupLinks,
      };
      onSubmit(itemData);
    }
  };

  // 그룹 선택/해제
  const handleToggleGroup = (group: Group) => {
    const exists = selectedGroups.find(g => g.groupId === group.id);
    if (exists) {
      setSelectedGroups(selectedGroups.filter(g => g.groupId !== group.id));
    } else {
      setSelectedGroups([...selectedGroups, { groupId: group.id, type: 'custom' as GroupType }]);
    }
  };

  // 그룹 타입 변경
  const handleChangeGroupType = (groupId: string, type: GroupType) => {
    setSelectedGroups(
      selectedGroups.map(g =>
        g.groupId === groupId ? { ...g, type, order: type === 'flow' ? g.order : undefined } : g,
      ),
    );
  };

  // 그룹 순서 변경 (flow 타입일 때만)
  const handleChangeGroupOrder = (groupId: string, order: number | undefined) => {
    setSelectedGroups(selectedGroups.map(g => (g.groupId === groupId ? { ...g, order } : g)));
  };

  // 그룹 생성 핸들러
  const handleCreateGroup = (groupData: {
    title: string;
    description: string;
    type: GroupType;
  }) => {
    if (!groupData.title.trim()) {
      showAlert('오류', '그룹명을 입력하세요');
      return;
    }
    const newGroup: Group = {
      id: Date.now().toString(),
      title: groupData.title.trim(),
      type: groupData.type,
      description: groupData.description.trim(),
      createdAt: new Date().toISOString(),
    };
    addGroup(newGroup);
    setSelectedGroups([...selectedGroups, { groupId: newGroup.id, type: groupData.type }]);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(formatDate(date));
    setShowStartDatePicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(formatDate(date));
    setShowEndDatePicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5); // HH:MM 형식
  };

  const handleStartTimeConfirm = (date: Date) => {
    setStartTime(formatTime(date));
    setShowStartTimePicker(false);
  };

  const handleEndTimeConfirm = (date: Date) => {
    setEndTime(formatTime(date));
    setShowEndTimePicker(false);
  };

  // Web date picker handlers
  const handleWebStartDateConfirm = (dateStr: string) => {
    setStartDate(dateStr);
    setShowWebStartDatePicker(false);
  };

  const handleWebEndDateConfirm = (dateStr: string) => {
    setEndDate(dateStr);
    setShowWebEndDatePicker(false);
  };

  const handleWebStartTimeConfirm = (timeStr: string) => {
    setStartTime(timeStr);
    setShowWebStartTimePicker(false);
  };

  const handleWebEndTimeConfirm = (timeStr: string) => {
    setEndTime(timeStr);
    setShowWebEndTimePicker(false);
  };

  return (
    <KeyboardAwareScrollView
      style={[COMMON_STYLES.container, { backgroundColor: COLORS.white }]}
      contentContainerStyle={{
        padding: SPACING.lg,
        gap: SPACING.xxl,
        paddingBottom: SPACING.xxxl,
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
      showsVerticalScrollIndicator={false}
    >
      <ItemFormFields
        title={title}
        setTitle={setTitle}
        type={type}
        setType={(v: string) => setType(v as ItemType)}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        repeat={repeat}
        setRepeat={(v: string | undefined) => setRepeat(v as RepeatCycle | undefined)}
        isSomeday={isSomeday}
        setIsSomeday={setIsSomeday}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        setShowEndDatePicker={setShowEndDatePicker}
        showStartTimePicker={showStartTimePicker}
        setShowStartTimePicker={setShowStartTimePicker}
        showEndTimePicker={showEndTimePicker}
        setShowEndTimePicker={setShowEndTimePicker}
        // Web date picker props
        showWebStartDatePicker={showWebStartDatePicker}
        setShowWebStartDatePicker={setShowWebStartDatePicker}
        showWebEndDatePicker={showWebEndDatePicker}
        setShowWebEndDatePicker={setShowWebEndDatePicker}
        showWebStartTimePicker={showWebStartTimePicker}
        setShowWebStartTimePicker={setShowWebStartTimePicker}
        showWebEndTimePicker={showWebEndTimePicker}
        setShowWebEndTimePicker={setShowWebEndTimePicker}
        repeatCycles={repeatCycles}
        itemTypes={itemTypes}
        presetDate={presetDate}
        note={note}
        setNote={setNote}
        checked={checked}
        setChecked={setChecked}
        // 다중 할일 항목 관련 props
        subItems={subItems}
        setSubItems={setSubItems}
        // 그룹 관련 props
        groups={groups}
        selectedGroups={selectedGroups}
        onToggleGroup={handleToggleGroup}
        onChangeGroupType={handleChangeGroupType}
        onChangeGroupOrder={handleChangeGroupOrder}
        onCreateGroup={handleCreateGroup}
      />

      <ItemFormFooter onCancel={onCancel} onSubmit={handleSubmit} isEditMode={!!editingItem} />
      {/* Date/Time Pickers는 그대로 유지 */}
      <DateTimePickerModal
        isVisible={showStartDatePicker}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setShowStartDatePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showEndDatePicker}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setShowEndDatePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showStartTimePicker}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={() => setShowStartTimePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showEndTimePicker}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={() => setShowEndTimePicker(false)}
      />

      {/* Web Date/Time Pickers */}
      <WebDatePickerModal
        visible={showWebStartDatePicker}
        mode="date"
        onConfirm={handleWebStartDateConfirm}
        onCancel={() => setShowWebStartDatePicker(false)}
        currentValue={startDate}
      />
      <WebDatePickerModal
        visible={showWebEndDatePicker}
        mode="date"
        onConfirm={handleWebEndDateConfirm}
        onCancel={() => setShowWebEndDatePicker(false)}
        currentValue={endDate}
      />
      <WebDatePickerModal
        visible={showWebStartTimePicker}
        mode="time"
        onConfirm={handleWebStartTimeConfirm}
        onCancel={() => setShowWebStartTimePicker(false)}
        currentValue={startTime}
      />
      <WebDatePickerModal
        visible={showWebEndTimePicker}
        mode="time"
        onConfirm={handleWebEndTimeConfirm}
        onCancel={() => setShowWebEndTimePicker(false)}
        currentValue={endTime}
      />
    </KeyboardAwareScrollView>
  );
}
