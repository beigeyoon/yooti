import React from 'react';
import { Alert, Platform } from 'react-native';
import { useState } from 'react';
import { Item } from '../../types/item';
import { useTimeStore } from '../../store/itemStore';
import ConfirmModal from '../common/ConfirmModal';

interface ConfirmModalState {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export function useItemActions(onEditItem?: (item: Item) => void) {
  const { deleteItem, deleteRoutineGroup, updateItem } = useTimeStore();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirmModal = (config: Omit<ConfirmModalState, 'visible'>) => {
    setConfirmModal({ ...config, visible: true });
  };

  const hideConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, visible: false }));
  };

  const handleDelete = (item: Item) => {
    if (Platform.OS === 'web') {
      // 웹에서는 커스텀 모달 사용
      if (item.type === 'routine' && item.routineGroupId) {
        showConfirmModal({
          title: '반복 아이템 삭제',
          message: `"${item.title}"을(를) 삭제하시겠습니까?`,
          onConfirm: () => {
            deleteItem(item.id);
            hideConfirmModal();
          },
          onCancel: hideConfirmModal,
          confirmText: '전체 삭제',
          cancelText: '취소',
          destructive: true,
        });
      } else {
        showConfirmModal({
          title: '아이템 삭제',
          message: `"${item.title}"을(를) 삭제하시겠습니까?`,
          onConfirm: () => {
            deleteItem(item.id);
            hideConfirmModal();
          },
          onCancel: hideConfirmModal,
          confirmText: '삭제',
          cancelText: '취소',
          destructive: true,
        });
      }
    } else {
      // 모바일에서는 기존 Alert 사용
      if (item.type === 'routine' && item.routineGroupId) {
        Alert.alert('반복 아이템 삭제', `"${item.title}"을(를) 삭제하시겠습니까?`, [
          { text: '취소', style: 'cancel' },
          {
            text: '이 날짜만',
            style: 'default',
            onPress: () => deleteItem(item.id),
          },
          {
            text: '전체 삭제',
            style: 'destructive',
            onPress: () => deleteRoutineGroup(item.routineGroupId!),
          },
        ]);
      } else {
        Alert.alert('아이템 삭제', `"${item.title}"을(를) 삭제하시겠습니까?`, [
          { text: '취소', style: 'cancel' },
          {
            text: '삭제',
            style: 'destructive',
            onPress: () => deleteItem(item.id),
          },
        ]);
      }
    }
  };

  const handleToggleCheck = (item: Item) => {
    if (item.type === 'todo' || item.type === 'routine') {
      updateItem(item.id, { ...item, checked: !item.checked });
    }
  };

  const handleEdit = (item: Item) => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const ConfirmModalComponent = () => {
    return (
      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        destructive={confirmModal.destructive}
      />
    );
  };

  return { handleDelete, handleToggleCheck, handleEdit, ConfirmModalComponent };
}
