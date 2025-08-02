import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ItemCardCheckbox from './ItemCardCheckbox';
import ItemCardIcon from './ItemCardIcon';
import ItemCardGroups from './ItemCardGroups';
import { Item, Group, SubItem } from '../../types/item';
import { Ionicons } from '@expo/vector-icons';
import { COMMON_STYLES, COLORS, SPACING } from '../../theme/styles';

interface ItemCardProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  onToggleCheck?: (item: Item) => void;
  onToggleSubItem?: (itemId: string, subItemId: string) => void;
  getItemColor: (item: Item) => string;
  groups?: Group[]; // 전체 그룹 목록
  showCheckbox?: boolean; // 체크박스 표시 여부 (기본값 true)
}

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onToggleCheck,
  onToggleSubItem,
  getItemColor,
  groups,
  showCheckbox = true,
}: ItemCardProps) {
  const [expandedSubItems, setExpandedSubItems] = useState(false);
  return (
    <View>
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
                  marginBottom: SPACING.sm,
                }}
              >
                <Ionicons name="create-outline" size={20} color={COLORS.tertiary} />
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
                  marginBottom: SPACING.sm,
                }}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      >
        <View
          style={[
            COMMON_STYLES.card,
            {
              paddingVertical: SPACING.md,
              paddingHorizontal: SPACING.md,
              marginBottom: SPACING.md,
              flexDirection: 'row',
              alignItems: 'flex-start',
              ...(item.type === 'deadline' || item.type === 'period' || item.type === 'event'
                ? {
                    borderRadius: SPACING.sm,
                    backgroundColor: getItemColor(item) + '10',
                    shadowOpacity: 0.05,
                    elevation: 1,
                  }
                : {}),
            },
          ]}
        >
          {/* 할일/반복: 체크박스 → 아이콘 순서, 그 외: 아이콘만 */}
          {item.type === 'todo' || item.type === 'routine' ? (
            <>
              {onToggleCheck && showCheckbox && (
                <ItemCardCheckbox
                  checked={!!item.checked}
                  color={getItemColor(item)}
                  onPress={() => onToggleCheck(item)}
                />
              )}
              <ItemCardIcon type={item.type} checked={!!item.checked} />
            </>
          ) : (
            <ItemCardIcon type={item.type} />
          )}

          {/* 제목/내용 */}
          <View style={{ flex: 1, flexDirection: 'column', minWidth: 0 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: 0,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
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
              <ItemCardGroups itemGroups={item.groups} allGroups={groups} />

              {/* 하위 항목 토글 버튼 */}
              {item.type === 'todo' && item.subItems && item.subItems.length > 0 && (
                <TouchableOpacity
                  onPress={() => setExpandedSubItems(!expandedSubItems)}
                  style={{ marginLeft: SPACING.sm }}
                >
                  <Ionicons
                    name={expandedSubItems ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={COLORS.tertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
            {item.note && (
              <Text
                style={{
                  color: '#b0b4ba',
                  fontSize: 12,
                  lineHeight: 16,
                  marginTop: 2,
                  ...(item.type === 'deadline' || item.type === 'period'
                    ? { fontSize: 11, lineHeight: 14 }
                    : {}),
                }}
                numberOfLines={2}
              >
                {item.note}
              </Text>
            )}

            {/* 하위 항목들 */}
            {item.type === 'todo' &&
              item.subItems &&
              item.subItems.length > 0 &&
              expandedSubItems && (
                <View style={{ marginTop: SPACING.sm }}>
                  {/* 체크되지 않은 하위 항목들 */}
                  {item.subItems
                    .filter(subItem => !subItem.checked)
                    .map((subItem, index) => (
                      <TouchableOpacity
                        key={subItem.id}
                        onPress={() => onToggleSubItem && onToggleSubItem(item.id, subItem.id)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: SPACING.xs,
                          marginBottom: 2,
                          marginLeft: -SPACING.xxxl,
                        }}
                      >
                        <View
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: COLORS.border,
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: SPACING.sm,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            color: COLORS.secondary,
                            flex: 1,
                          }}
                          numberOfLines={1}
                        >
                          {subItem.title}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  {/* 체크된 하위 항목들 */}
                  {item.subItems
                    .filter(subItem => subItem.checked)
                    .map((subItem, index) => (
                      <TouchableOpacity
                        key={subItem.id}
                        onPress={() => onToggleSubItem && onToggleSubItem(item.id, subItem.id)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: SPACING.xs,
                          marginBottom: 2,
                          marginLeft: -SPACING.xxxl,
                        }}
                      >
                        <View
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: COLORS.primary,
                            backgroundColor: COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: SPACING.sm,
                          }}
                        >
                          <Ionicons name="checkmark" size={10} color="white" />
                        </View>
                        <Text
                          style={{
                            fontSize: 13,
                            color: COLORS.tertiary,
                            textDecorationLine: 'line-through',
                            flex: 1,
                          }}
                          numberOfLines={1}
                        >
                          {subItem.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
          </View>
        </View>
      </Swipeable>
    </View>
  );
}
