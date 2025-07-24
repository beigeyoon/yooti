import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

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
  checked: boolean;
  setChecked: (v: boolean) => void;
}

export default function ItemFormFields(props: ItemFormFieldsProps) {
  // ...기존 입력 필드 UI/로직을 이곳에 옮기세요 (props로 상태/핸들러 전달)
  // 예시: 제목, 타입, 날짜, 시간, 반복, 노트 등
  const getKoreanDay = (dateStr: string) => {
    if (!dateStr) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = dayjs(dateStr);
    return days[d.day()];
  };
  return (
    <View>
      {/* 제목 */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
          제목
        </Text>
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
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
          타입
        </Text>
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
      {/* 언젠가(날짜 미정) 체크박스 */}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 0 }}
        onPress={() => props.setIsSomeday(!props.isSomeday)}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: props.isSomeday ? '#111827' : '#d1d5db',
            backgroundColor: props.isSomeday ? '#111827' : 'transparent',
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {props.isSomeday && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <Text style={{ fontSize: 15, color: '#374151', fontWeight: '500' }}>언젠가 (someday)</Text>
      </TouchableOpacity>
      {/* 언젠가 설명 문구 */}
      <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, marginLeft: 2 }}>
        언젠가를 선택하면 날짜 없이 아이템을 등록할 수 있어요
      </Text>
      {/* 날짜/시간 선택: 타입별 조건부 렌더링 */}
      {/* 할일: 날짜/시간 모두 숨김 */}
      {/* 반복: 날짜만, 시간 숨김 */}
      {/* 기간: 날짜만, 시간 숨김 */}
      {/* 마감일: 시작일/종료일 중 실제로 쓰이는 필드만, 시간 숨김 */}
      {/* 이벤트: 날짜/시간 모두 노출 */}
      {!props.isSomeday && (
        <>
          {props.type === 'event' && (
            <>
              {/* 날짜 선택 */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
                  날짜
                </Text>
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
                      {props.startDate
                        ? `${props.startDate} (${getKoreanDay(props.startDate)})`
                        : '시작일 선택'}
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
                      {props.endDate
                        ? `${props.endDate} (${getKoreanDay(props.endDate)})`
                        : '종료일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* 시간 선택 */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
                  시간
                </Text>
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
            </>
          )}
          {props.type === 'routine' && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
                날짜
              </Text>
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
                    {props.startDate
                      ? `${props.startDate} (${getKoreanDay(props.startDate)})`
                      : '시작일 선택'}
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
                    {props.endDate
                      ? `${props.endDate} (${getKoreanDay(props.endDate)})`
                      : '종료일 선택'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {props.type === 'period' && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
                날짜
              </Text>
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
                    {props.startDate
                      ? `${props.startDate} (${getKoreanDay(props.startDate)})`
                      : '시작일 선택'}
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
                    {props.endDate
                      ? `${props.endDate} (${getKoreanDay(props.endDate)})`
                      : '종료일 선택'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {props.type === 'deadline' && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
                마감일
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
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
                    {props.endDate || '마감일 선택'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {props.type === 'todo' && (
            <>
              {/* 완료 예정일 */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
                  완료 예정일
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
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
                      {props.endDate || '완료 예정일 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* 완료 여부 */}
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '600', lineHeight: 22 }}>완료 여부</Text>
                <TouchableOpacity
                  onPress={() => props.setChecked && props.setChecked(!props.checked)}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: props.checked ? '#111827' : '#d1d5db',
                      backgroundColor: props.checked ? '#111827' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {props.checked && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
      {/* 반복 선택: type이 'routine'일 때만 표시 */}
      {props.type === 'routine' && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
            반복
          </Text>
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
      )}
      {/* 노트 입력 */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, lineHeight: 22 }}>
          노트
        </Text>
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
