import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

interface GroupSwipeableCardProps {
  group: any;
  itemCount: number;
  onEdit: (group: any) => void;
  onDelete: (groupId: string) => void;
  expanded: boolean;
  onPress: () => void;
  children?: React.ReactNode;
}

export default function GroupSwipeableCard({
  group,
  itemCount,
  onEdit,
  onDelete,
  expanded,
  onPress,
  children,
}: GroupSwipeableCardProps) {
  const SWIPE_THRESHOLD = 30;
  const translateX = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newTranslateX = context.startX + event.translationX;
      translateX.value = Math.min(0, Math.max(-120, newTranslateX));
    },
    onEnd: event => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = -120;
      } else {
        translateX.value = 0;
      }
    },
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const actionButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + 120 }],
    opacity: translateX.value < -10 ? 1 : 0,
  }));

  const GROUP_TYPE_LABELS: Record<string, string> = {
    flow: '순서형',
    related: '연관형',
    dependency: '의존형',
    custom: '커스텀',
  };

  return (
    <View style={{ marginBottom: 12 }}>
      {/* 액션 버튼들 (배경) */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            flexDirection: 'row',
            width: 120,
            zIndex: 1,
          },
          actionButtonsStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => onEdit(group)}
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
            height: '100%',
          }}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.ui.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(group.id)}
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
            height: '100%',
          }}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.ui.text.tertiary} />
        </TouchableOpacity>
      </Animated.View>
      {/* 전체(카드+아코디언) 슬라이드 */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[{ zIndex: 2 }, animatedStyle]}>
          {/* 메인 그룹 카드 */}
          <View
            style={{
              padding: 16,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottomLeftRadius: expanded ? 0 : 12,
              borderBottomRightRadius: expanded ? 0 : 12,
              backgroundColor: COLORS.ui.white,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: COLORS.ui.borderLight,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, minWidth: 0 }}
              activeOpacity={0.7}
              onPress={onPress}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 17, fontWeight: '600', color: COLORS.ui.text.primary }}>
                    {group.title}
                    <Text style={{ color: COLORS.itemTypes.todo, fontSize: 15 }}>
                      {' '}
                      ({itemCount})
                    </Text>
                  </Text>
                  {!!group.description && (
                    <Text
                      style={{ color: COLORS.ui.text.tertiary, fontSize: 14, marginTop: 2 }}
                      numberOfLines={2}
                    >
                      {group.description}
                    </Text>
                  )}
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <View
                        style={{
                          backgroundColor: '#f3f4f6',
                          borderColor: (COLORS.itemTypes as any)[group.type] || '#d1d5db',
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          marginRight: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: (COLORS.itemTypes as any)[group.type] || '#374151',
                            fontSize: 12,
                            fontWeight: '500',
                          }}
                        >
                          {GROUP_TYPE_LABELS[group.type] || group.type}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: COLORS.ui.text.muted, fontSize: 13 }}>
                      생성: {group.createdAt.slice(0, 10)}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color={COLORS.ui.text.tertiary}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* 아코디언 하위 아이템 영역 */}
          {expanded && (
            <View
              style={{
                backgroundColor: COLORS.ui.background,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                borderWidth: 1,
                borderTopWidth: 0,
                borderColor: COLORS.ui.borderLight,
                marginTop: -2,
                marginBottom: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              {children}
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
