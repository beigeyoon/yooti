import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface ItemFormFieldsProps {
  title: string;
  setTitle: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;
  repeat: string | undefined;
  setRepeat: (v: string | undefined) => void;
  isSomeday: boolean;
  setIsSomeday: (v: boolean) => void;
  showStartDatePicker: boolean;
  setShowStartDatePicker: (v: boolean) => void;
  showEndDatePicker: boolean;
  setShowEndDatePicker: (v: boolean) => void;
  showStartTimePicker: boolean;
  setShowStartTimePicker: (v: boolean) => void;
  showEndTimePicker: boolean;
  setShowEndTimePicker: (v: boolean) => void;
  repeatCycles: { value: string; label: string }[];
  itemTypes: { value: string; label: string }[];
  presetDate?: string;
  note: string;
  setNote: (v: string) => void;
}

export default function ItemFormFields(props: ItemFormFieldsProps) {
  // ...기존 입력 필드 UI/로직을 이곳에 옮기세요 (props로 상태/핸들러 전달)
  // 예시: 제목, 타입, 날짜, 시간, 반복, 노트 등
  return (
    <View>
      {/* 제목 */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>제목</Text>
        <TextInput
          value={props.title}
          onChangeText={props.setTitle}
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
      {/* 타입 선택 */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>타입</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {props.itemTypes.map(opt => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => props.setType(opt.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: props.type === opt.value ? '#000' : '#d1d5db',
                backgroundColor: props.type === opt.value ? '#000' : 'white',
              }}
            >
              <Text style={{ color: props.type === opt.value ? 'white' : '#374151' }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* 날짜 선택 */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>날짜</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => props.setShowStartDatePicker(true)}
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#d1d5db',
            }}
          >
            <Text style={{ color: '#374151', textAlign: 'center' }}>
              {props.startDate || '시작일 선택'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.setShowEndDatePicker(true)}
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#d1d5db',
            }}
          >
            <Text style={{ color: '#374151', textAlign: 'center' }}>
              {props.endDate || '종료일 선택'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 시간 선택 */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>시간</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => props.setShowStartTimePicker(true)}
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#d1d5db',
            }}
          >
            <Text style={{ color: '#374151', textAlign: 'center' }}>
              {props.startTime || '시작시간'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.setShowEndTimePicker(true)}
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#d1d5db',
            }}
          >
            <Text style={{ color: '#374151', textAlign: 'center' }}>
              {props.endTime || '종료시간'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 반복 선택 */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>반복</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {props.repeatCycles.map(opt => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => props.setRepeat(opt.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: props.repeat === opt.value ? '#000' : '#d1d5db',
                backgroundColor: props.repeat === opt.value ? '#000' : 'white',
              }}
            >
              <Text style={{ color: props.repeat === opt.value ? 'white' : '#374151' }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* 노트 입력 */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>노트</Text>
        <TextInput
          value={props.note}
          onChangeText={props.setNote}
          placeholder="메모/노트 (선택)"
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 12,
            fontSize: 15,
            minHeight: 40,
            textAlignVertical: 'top',
          }}
          multiline
        />
      </View>
    </View>
  );
}
