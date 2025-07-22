import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Item, Group } from '../../types/item';

interface ItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  onToggleCheck?: (item: Item) => void;
  getItemColor: (item: Item) => string;
  groups?: Group[]; // 전체 그룹 목록
  showCheckbox?: boolean; // 체크박스 표시 여부 (기본값 true)
}

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onToggleCheck,
  getItemColor,
  groups,
  showCheckbox = true,
}: ItemCardProps) {
  return (
    <Swipeable
      renderRightActions={() => (
        <View style={{ flexDirection: 'row' }}>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 'auto',
                marginBottom: 8,
              }}
            >
              <Ionicons name="create-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(item)}
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 'auto',
                marginBottom: 8,
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      )}
    >
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          marginBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 1,
          flexDirection: 'row',
          alignItems: 'center',
          ...(item.type === 'deadline' || item.type === 'period' || item.type === 'event'
            ? {
                borderRadius: 8,
                backgroundColor: getItemColor(item) + '10',
                shadowOpacity: 0.05,
                elevation: 1,
              }
            : {}),
        }}
      >
        {/* 할일/반복: 체크박스 → 아이콘 순서, 그 외: 아이콘만 */}
        {item.type === 'todo' || item.type === 'routine' ? (
          <>
            {onToggleCheck && showCheckbox && (
              <TouchableOpacity
                onPress={() => onToggleCheck(item)}
                style={{
                  marginRight: 10,
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: item.checked ? getItemColor(item) : '#d1d5db',
                  backgroundColor: item.checked ? getItemColor(item) : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.checked && <Ionicons name="checkmark" size={14} color="white" />}
              </TouchableOpacity>
            )}
            <Ionicons
              name={item.type === 'todo' ? 'list-outline' : 'repeat-outline'}
              size={20}
              color={item.type === 'todo' ? '#3b82f6' : '#8b5cf6'}
              style={{ marginRight: 10 }}
            />
          </>
        ) : (
          <Ionicons
            name={
              (() => {
                if (item.type === 'event') return 'time-outline'; // 이벤트형: 시계 아이콘
                if (item.type === 'deadline') return 'alert-circle-outline';
                if (item.type === 'period') return 'calendar-outline'; // 기간형: 더 직관적인 달력 아이콘
                return 'ellipse-outline';
              })() as any
            }
            size={20}
            color={(() => {
              if (item.type === 'event') return '#f97316'; // orange
              if (item.type === 'deadline') return '#ec4899'; // pink
              if (item.type === 'period') return '#06b6d4'; // mint
              return '#9ca3af';
            })()}
            style={{ marginRight: 10 }}
          />
        )}

        {/* 제목/내용 */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: '#111827',
                lineHeight: 22,
                textAlignVertical: 'center',
                ...((item.type === 'todo' || item.type === 'routine') && item.checked
                  ? {
                      textDecorationLine: 'line-through',
                      color: '#9ca3af',
                    }
                  : {}),
                ...(item.type === 'deadline' || item.type === 'period' || item.type === 'event'
                  ? { color: getItemColor(item) }
                  : {}),
                flexShrink: 1,
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {/* 이벤트/기간형: 타이틀 옆에 소형 회색 텍스트 (sibling) */}
            {item.type === 'event' && (item.startTime || item.endTime) && (
              <Text
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 'normal',
                  lineHeight: 16,
                  marginLeft: 5,
                }}
                numberOfLines={1}
              >
                {item.startTime && item.endTime
                  ? `${item.startTime} - ${item.endTime}`
                  : item.startTime
                    ? `${item.startTime}`
                    : `${item.endTime}`}
              </Text>
            )}
            {item.type === 'period' && item.startDate && item.endDate && (
              <Text
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 'normal',
                  lineHeight: 16,
                  marginLeft: 5,
                }}
                numberOfLines={1}
              >
                {item.startDate} ~ {item.endDate}
              </Text>
            )}
          </View>
          {/* 그룹명 칩 (우측 끝 정렬) */}
          {item.groups && item.groups.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                marginLeft: 8,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {item.groups.slice(0, 2).map((g, idx) => {
                const groupName = (groups || []).find(gr => gr.id === g.groupId)?.title || '그룹';
                return (
                  <View
                    key={g.groupId}
                    style={{
                      backgroundColor: '#e0e7ef',
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                      minWidth: 24,
                    }}
                  >
                    <Text
                      style={{
                        color: '#374151',
                        fontSize: 10,
                        lineHeight: 14,
                        textAlignVertical: 'center',
                      }}
                      numberOfLines={1}
                    >
                      {groupName}
                    </Text>
                  </View>
                );
              })}
              {item.groups.length > 2 && (
                <View
                  style={{
                    backgroundColor: '#e0e7ef',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                    minWidth: 24,
                  }}
                >
                  <Text
                    style={{
                      color: '#374151',
                      fontSize: 10,
                      lineHeight: 14,
                      textAlignVertical: 'center',
                    }}
                  >
                    +{item.groups.length - 2}
                  </Text>
                </View>
              )}
            </View>
          )}
          {item.note && (
            <Text
              style={{
                color: '#6b7280',
                fontSize: 12,
                lineHeight: 16,
                ...(item.type === 'deadline' || item.type === 'period'
                  ? { fontSize: 11, lineHeight: 14 }
                  : {}),
              }}
              numberOfLines={2}
            >
              {item.note}
            </Text>
          )}
        </View>
      </View>
    </Swipeable>
  );
}
