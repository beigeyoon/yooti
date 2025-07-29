import { useTimeStore } from '../store/itemStore';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { GroupType } from '../types/item';
import { COLORS } from '../theme/colors';
import { Item } from '../types/item';
import GroupSwipeableCard from '../components/Group/GroupSwipeableCard';
import GroupEditModal from '../components/Group/GroupEditModal';
import ItemCard from '../components/Item/ItemCard';
import EmptyState from '../components/common/EmptyState';
import { COMMON_STYLES, SPACING, FONT_SIZE, FONT_WEIGHT } from '../theme/styles';
import ConfirmModal from '../components/common/ConfirmModal';

const GROUP_TYPE_OPTIONS = [
  { value: 'flow', label: '순서형' },
  { value: 'related', label: '연관형' },
  { value: 'dependency', label: '의존형' },
  { value: 'custom', label: '커스텀' },
];

export default function GroupsScreen() {
  const { groups, items, deleteGroup, updateGroup, addGroup } = useTimeStore();
  const [editModal, setEditModal] = useState<null | {
    id: string;
    title: string;
    description: string;
    type: GroupType;
  }>(null);

  // 어떤 그룹이 펼쳐져 있는지 상태 관리
  const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);

  // 새 그룹 생성 모달 상태
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newGroup, setNewGroup] = useState({
    title: '',
    description: '',
    type: 'custom' as GroupType,
  });

  // 그룹 삭제 확인 모달 상태
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    visible: boolean;
    groupId: string;
  }>({
    visible: false,
    groupId: '',
  });

  const handleCreateGroup = () => {
    if (!newGroup.title.trim()) {
      if (Platform.OS === 'web') {
        // 웹에서는 간단한 alert 사용 (브라우저 기본 alert)
        alert('그룹명을 입력하세요');
      } else {
        Alert.alert('오류', '그룹명을 입력하세요');
      }
      return;
    }
    const group = {
      id: Date.now().toString(),
      title: newGroup.title.trim(),
      type: newGroup.type,
      description: newGroup.description.trim(),
      createdAt: new Date().toISOString(),
    };
    addGroup(group);
    setNewGroup({ title: '', description: '', type: 'custom' });
    setCreateModalVisible(false);
  };

  // 그룹 카드 클릭 시 아코디언 토글
  const handleToggleExpand = (groupId: string) => {
    setExpandedGroupIds(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId],
    );
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      // 웹에서는 커스텀 모달 사용
      setDeleteConfirmModal({
        visible: true,
        groupId: id,
      });
    } else {
      // 모바일에서는 기존 Alert 사용
      Alert.alert('그룹 삭제', '정말로 이 그룹을 삭제하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => deleteGroup(id) },
      ]);
    }
  };

  const handleDeleteConfirm = () => {
    deleteGroup(deleteConfirmModal.groupId);
    setDeleteConfirmModal({ visible: false, groupId: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmModal({ visible: false, groupId: '' });
  };

  const handleEdit = (group: {
    id: string;
    title: string;
    description?: string;
    type: GroupType;
  }) => {
    setEditModal({
      id: group.id,
      title: group.title,
      description: group.description || '',
      type: group.type,
    });
  };

  const handleEditSave = () => {
    if (!editModal) return;
    updateGroup(editModal.id, {
      title: editModal.title.trim(),
      description: editModal.description.trim(),
      type: editModal.type,
    });
    setEditModal(null);
  };

  const SWIPE_THRESHOLD = 30;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.ui.background }}>
      {/* 상단 새 그룹 만들기 버튼 */}
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <TouchableOpacity
          onPress={() => setCreateModalVisible(true)}
          style={{
            marginBottom: 0,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#d1d5db',
            backgroundColor: '#f3f4f6',
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: '#374151', fontWeight: '600', fontSize: 15 }}>
            + 새 그룹 만들기
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {groups.length === 0 ? (
          <Text
            style={{
              color: COLORS.ui.text.muted,
              fontSize: 16,
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            아직 생성된 그룹이 없습니다.
          </Text>
        ) : (
          groups.map(group => {
            const itemCount = items.filter(item =>
              item.groups?.some(g => g.groupId === group.id),
            ).length;
            const groupItems = items.filter(item => item.groups?.some(g => g.groupId === group.id));
            const expanded = expandedGroupIds.includes(group.id);
            return (
              <GroupSwipeableCard
                key={group.id}
                group={group}
                itemCount={itemCount}
                onEdit={handleEdit}
                onDelete={handleDelete}
                expanded={expanded}
                onPress={() => handleToggleExpand(group.id)}
              >
                {groupItems.length === 0 ? (
                  <Text
                    style={{
                      color: COLORS.ui.text.muted,
                      fontSize: 14,
                      textAlign: 'center',
                      paddingVertical: 8,
                    }}
                  >
                    이 그룹에 속한 아이템이 없습니다.
                  </Text>
                ) : (
                  groupItems.map((item, idx) => (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        backgroundColor: COLORS.ui.white,
                        borderRadius: 8,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        marginBottom: idx === groupItems.length - 1 ? 0 : 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 2,
                        elevation: 1,
                      }}
                    >
                      {/* 타입별 아이콘 */}
                      <Ionicons
                        name={
                          (() => {
                            if (item.type === 'todo') return 'list-outline';
                            if (item.type === 'routine') return 'repeat-outline';
                            if (item.type === 'event') return 'time-outline';
                            if (item.type === 'deadline') return 'alert-circle-outline';
                            if (item.type === 'period') return 'calendar-outline';
                            return 'ellipse-outline';
                          })() as any
                        }
                        size={20}
                        color={(() => {
                          if (item.type === 'todo') return '#3b82f6';
                          if (item.type === 'routine') return '#8b5cf6';
                          if (item.type === 'event') return '#f97316';
                          if (item.type === 'deadline') return '#ec4899';
                          if (item.type === 'period') return '#06b6d4';
                          return '#9ca3af';
                        })()}
                        style={{ marginRight: 10, marginTop: 2 }}
                      />
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '600',
                              color: '#111827',
                              lineHeight: 22,
                            }}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          {/* 이벤트형: 타이틀 옆에 시간 */}
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
                          {/* 기간형: 타이틀 옆에 기간 */}
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
                        {item.note && (
                          <Text
                            style={{
                              fontSize: 13,
                              color: '#6b7280',
                              marginTop: 2,
                            }}
                            numberOfLines={1}
                          >
                            {item.note}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </GroupSwipeableCard>
            );
          })
        )}
      </ScrollView>
      {/* 수정 모달 */}
      <GroupEditModal
        visible={!!editModal}
        group={editModal}
        onChange={patch => setEditModal(m => m && { ...m, ...patch })}
        onClose={() => setEditModal(null)}
        onSubmit={handleEditSave}
      />
      {/* 새 그룹 생성 모달 */}
      <GroupEditModal
        visible={createModalVisible}
        group={newGroup}
        isCreate
        onChange={patch => setNewGroup(prev => ({ ...prev, ...patch }))}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateGroup}
      />
      {/* 그룹 삭제 확인 모달 */}
      <ConfirmModal
        visible={deleteConfirmModal.visible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="그룹 삭제"
        message={`정말로 "${groups.find(g => g.id === deleteConfirmModal.groupId)?.title}" 그룹을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        destructive={true}
      />
    </View>
  );
}
