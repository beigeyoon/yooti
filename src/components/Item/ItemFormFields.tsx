import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import DateInput from './DateInput';
import SelectableButton from '../common/SelectableButton';
import FormSection from '../common/FormSection';
import ItemFormGroupSelector from './ItemFormGroupSelector';
import { COMMON_STYLES, COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../theme/styles';
import type { Group, GroupType, GroupLink } from '../../types/item';

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
  // 그룹 관련 props
  groups: Group[];
  selectedGroups: GroupLink[];
  onToggleGroup: (group: Group) => void;
  onChangeGroupType: (groupId: string, type: GroupType) => void;
  onChangeGroupOrder: (groupId: string, order: number | undefined) => void;
  onCreateGroup: (group: { title: string; description: string; type: GroupType }) => void;
}

export default function ItemFormFields(props: ItemFormFieldsProps) {
  // ...기존 입력 필드 UI/로직을 이곳에 옮기세요 (props로 상태/핸들러 전달)
  // 예시: 제목, 타입, 날짜, 시간, 반복, 노트 등
  return (
    <View>
      {/* 제목 */}
      <FormSection title="제목" isFirstSection={true}>
        <TextInput
          value={props.title}
          onChangeText={props.setTitle}
          placeholder="아이템 제목을 입력하세요"
          style={[COMMON_STYLES.input, { height: 48, textAlignVertical: 'center' }]}
        />
      </FormSection>

      {/* 타입 선택 */}
      <FormSection title="타입">
        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
          {props.itemTypes.map(opt => (
            <SelectableButton
              key={opt.value}
              label={opt.label}
              value={opt.value}
              isSelected={props.type === opt.value}
              onPress={() => props.setType(opt.value)}
            />
          ))}
        </View>
      </FormSection>
      {/* 언젠가(날짜 미정) 체크박스 */}
      <TouchableOpacity
        style={[COMMON_STYLES.row, { marginTop: SPACING.lg, marginBottom: 0 }]}
        onPress={() => props.setIsSomeday(!props.isSomeday)}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: props.isSomeday ? COLORS.primary : COLORS.border,
            backgroundColor: props.isSomeday ? COLORS.primary : 'transparent',
            marginRight: SPACING.sm,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {props.isSomeday && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <Text style={[COMMON_STYLES.bodyText, { fontWeight: FONT_WEIGHT.medium }]}>
          언젠가 (someday)
        </Text>
      </TouchableOpacity>
      {/* 언젠가 설명 문구 */}
      <Text style={[COMMON_STYLES.caption, { marginTop: SPACING.xs, marginLeft: 2 }]}>
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
              <FormSection title="날짜">
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  <DateInput
                    label="시작일"
                    value={props.startDate}
                    placeholder="시작일"
                    onPress={() => props.setShowStartDatePicker(true)}
                  />
                  <DateInput
                    label="종료일"
                    value={props.endDate}
                    placeholder="종료일"
                    onPress={() => props.setShowEndDatePicker(true)}
                  />
                </View>
              </FormSection>
              {/* 시간 선택 */}
              <FormSection title="시간">
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  <DateInput
                    label="시작시간"
                    value={props.startTime}
                    placeholder="시작시간"
                    onPress={() => props.setShowStartTimePicker(true)}
                    showDay={false}
                  />
                  <DateInput
                    label="종료시간"
                    value={props.endTime}
                    placeholder="종료시간"
                    onPress={() => props.setShowEndTimePicker(true)}
                    showDay={false}
                  />
                </View>
              </FormSection>
            </>
          )}
          {props.type === 'routine' && (
            <FormSection title="날짜">
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <DateInput
                  label="시작일"
                  value={props.startDate}
                  placeholder="시작일"
                  onPress={() => props.setShowStartDatePicker(true)}
                />
                <DateInput
                  label="종료일"
                  value={props.endDate}
                  placeholder="종료일"
                  onPress={() => props.setShowEndDatePicker(true)}
                />
              </View>
            </FormSection>
          )}
          {props.type === 'period' && (
            <FormSection title="날짜">
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <DateInput
                  label="시작일"
                  value={props.startDate}
                  placeholder="시작일"
                  onPress={() => props.setShowStartDatePicker(true)}
                />
                <DateInput
                  label="종료일"
                  value={props.endDate}
                  placeholder="종료일"
                  onPress={() => props.setShowEndDatePicker(true)}
                />
              </View>
            </FormSection>
          )}
          {props.type === 'deadline' && (
            <FormSection title="마감일">
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <DateInput
                  label="마감일"
                  value={props.endDate}
                  placeholder="마감일"
                  onPress={() => props.setShowEndDatePicker(true)}
                />
              </View>
            </FormSection>
          )}
          {props.type === 'todo' && (
            <>
              {/* 완료 예정일 */}
              <FormSection title="완료 예정일">
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  <DateInput
                    label="완료 예정일"
                    value={props.endDate}
                    placeholder="완료 예정일"
                    onPress={() => props.setShowEndDatePicker(true)}
                  />
                </View>
              </FormSection>
              {/* 완료 여부 */}
              <View
                style={[
                  COMMON_STYLES.row,
                  {
                    marginTop: SPACING.xl,
                    marginBottom: 0,
                    gap: SPACING.sm,
                  },
                ]}
              >
                <Text style={COMMON_STYLES.sectionTitle}>완료 여부</Text>
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
                      borderColor: props.checked ? COLORS.primary : COLORS.border,
                      backgroundColor: props.checked ? COLORS.primary : 'transparent',
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
        <FormSection title="반복">
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            {props.repeatCycles.map(opt => (
              <SelectableButton
                key={opt.value}
                label={opt.label}
                value={opt.value}
                isSelected={props.repeat === opt.value}
                onPress={() => props.setRepeat(opt.value)}
              />
            ))}
          </View>
        </FormSection>
      )}
      {/* 노트 입력 */}
      <FormSection title="노트">
        <TextInput
          value={props.note}
          onChangeText={props.setNote}
          placeholder="메모/노트 (선택)"
          style={[COMMON_STYLES.input, { minHeight: 40, textAlignVertical: 'top' }]}
          multiline
        />
      </FormSection>

      {/* 그룹 할당 */}
      <ItemFormGroupSelector
        groups={props.groups}
        selectedGroups={props.selectedGroups}
        onToggleGroup={props.onToggleGroup}
        onChangeGroupType={props.onChangeGroupType}
        onChangeGroupOrder={props.onChangeGroupOrder}
        onCreateGroup={props.onCreateGroup}
      />
    </View>
  );
}
