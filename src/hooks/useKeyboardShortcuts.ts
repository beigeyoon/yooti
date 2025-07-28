import { useEffect } from 'react';
import { Platform } from 'react-native';

interface KeyboardShortcutsProps {
  onNewItem?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const useKeyboardShortcuts = ({
  onNewItem,
  onSave,
  onCancel,
  onDelete,
  onEdit,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + N: 새 아이템
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        onNewItem?.();
      }

      // Ctrl/Cmd + S: 저장
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave?.();
      }

      // Escape: 취소
      if (event.key === 'Escape') {
        onCancel?.();
      }

      // Delete: 삭제
      if (event.key === 'Delete') {
        onDelete?.();
      }

      // Ctrl/Cmd + E: 편집
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        onEdit?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNewItem, onSave, onCancel, onDelete, onEdit]);
};
