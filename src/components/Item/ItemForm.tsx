import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Item, ItemType, RepeatCycle } from '../../types/item';

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
  const [note, setNote] = useState(editingItem?.note || '');
  const [isSomeday, setIsSomeday] = useState(false);

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return;
    }

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
        note: note.trim() || undefined,
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
        note: note.trim() || undefined,
      };
      onSubmit(itemData);
    }
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

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ padding: 16, gap: 24 }}>
          {/* 제목 */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>제목</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="아이템 제목을 입력하세요"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                height: 48,
                textAlignVertical: 'center',
              }}
            />
          </View>

          {/* 타입 */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>타입</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {itemTypes.map(itemType => (
                <TouchableOpacity
                  key={itemType.value}
                  onPress={() => setType(itemType.value)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: type === itemType.value ? '#000000' : '#d1d5db',
                    backgroundColor: type === itemType.value ? '#000000' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: type === itemType.value ? 'white' : '#374151',
                    }}
                  >
                    {itemType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 날짜 선택 */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>날짜 (선택)</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
              '언젠가'를 선택하면 날짜가 설정되지 않습니다.
            </Text>

            {/* 언젠가 체크박스 */}
            <TouchableOpacity
              onPress={() => {
                setIsSomeday(!isSomeday);
                if (!isSomeday) {
                  // 언젠가로 설정할 때 날짜들 초기화
                  setStartDate('');
                  setEndDate('');
                  setStartTime('');
                  setEndTime('');
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: isSomeday ? '#000000' : '#d1d5db',
                  backgroundColor: isSomeday ? '#000000' : 'transparent',
                  marginRight: 12,
                }}
              >
                {isSomeday && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 16, color: '#374151' }}>언젠가 (Someday)</Text>
            </TouchableOpacity>

            {!isSomeday && type === 'todo' ? (
              // 할 일: 완료 예정일만 표시
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>완료 예정일</Text>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#111827' }}>
                    {endDate || '완료 예정일 선택'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : !isSomeday && type === 'event' ? (
              // 이벤트: startDate, endDate 모두 optional
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>시작일</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#111827' }}>
                      {startDate || '시작일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                    종료일 (선택)
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEndDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 12,
                      borderColor: !startDate ? '#e5e7eb' : '#d1d5db',
                      backgroundColor: !startDate ? '#f9fafb' : 'white',
                    }}
                    disabled={!startDate}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: !startDate ? '#9ca3af' : '#111827',
                      }}
                    >
                      {endDate || '종료일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 시간 선택 (이벤트 전용) */}
                <View style={{ gap: 12 }}>
                  <View>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                      시작 시간 (선택)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowStartTimePicker(true)}
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        padding: 12,
                      }}
                    >
                      <Text style={{ fontSize: 16, color: '#111827' }}>
                        {startTime || '시작 시간 선택'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                      종료 시간 (선택)
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowEndTimePicker(true)}
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        borderColor: !startTime ? '#e5e7eb' : '#d1d5db',
                        backgroundColor: !startTime ? '#f9fafb' : 'white',
                      }}
                      disabled={!startTime}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: !startTime ? '#9ca3af' : '#111827',
                        }}
                      >
                        {endTime || '종료 시간 선택'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : !isSomeday && type === 'routine' ? (
              // 반복: startDate, endDate 모두 optional
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>시작일</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#111827' }}>
                      {startDate || '시작일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                    종료일 (선택)
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEndDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 12,
                      borderColor: !startDate ? '#e5e7eb' : '#d1d5db',
                      backgroundColor: !startDate ? '#f9fafb' : 'white',
                    }}
                    disabled={!startDate}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: !startDate ? '#9ca3af' : '#111827',
                      }}
                    >
                      {endDate || '종료일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : !isSomeday && type === 'deadline' ? (
              // 마감일: endDate만 표시
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>마감일</Text>
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#111827' }}>{endDate || '마감일 선택'}</Text>
                </TouchableOpacity>
              </View>
            ) : !isSomeday && type === 'period' ? (
              // 기간: startDate, endDate 모두 설정 가능
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>시작일</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#111827' }}>
                      {startDate || '시작일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
                    종료일 (선택)
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEndDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 12,
                      borderColor: !startDate ? '#e5e7eb' : '#d1d5db',
                      backgroundColor: !startDate ? '#f9fafb' : 'white',
                    }}
                    disabled={!startDate}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: !startDate ? '#9ca3af' : '#111827',
                      }}
                    >
                      {endDate || '종료일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>

          {/* 반복 (반복 전용) */}
          {type === 'routine' && (
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>반복 (선택)</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setRepeat(undefined)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: !repeat ? '#000000' : '#d1d5db',
                    backgroundColor: !repeat ? '#000000' : 'transparent',
                  }}
                >
                  <Text style={{ color: !repeat ? 'white' : '#374151' }}>반복 안함</Text>
                </TouchableOpacity>
                {repeatCycles.map(cycle => (
                  <TouchableOpacity
                    key={cycle.value}
                    onPress={() => setRepeat(cycle.value)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: repeat === cycle.value ? '#000000' : '#d1d5db',
                      backgroundColor: repeat === cycle.value ? '#000000' : 'transparent',
                    }}
                  >
                    <Text style={{ color: repeat === cycle.value ? 'white' : '#374151' }}>
                      {cycle.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 완료 여부 (할 일 전용) */}
          {type === 'todo' && (
            <View>
              <TouchableOpacity
                onPress={() => setChecked(!checked)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: checked ? '#000000' : '#d1d5db',
                    backgroundColor: checked ? '#000000' : 'transparent',
                  }}
                >
                  {checked && <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>}
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>완료 여부</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 메모 */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>메모 (선택)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="추가 메모를 입력하세요"
              multiline
              numberOfLines={4}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                textAlignVertical: 'top',
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* 버튼 - 화면 하단에 고정 */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingHorizontal: 16,
          paddingVertical: 16,
          paddingBottom: 20, // 적절한 하단 여백
        }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: '#d1d5db',
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ textAlign: 'center', color: '#374151', fontWeight: '600' }}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              flex: 1,
              backgroundColor: '#000000',
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Pickers */}
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

      {/* Time Pickers */}
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
    </View>
  );
}
