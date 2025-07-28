import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';

interface DragAndDropProps {
  onDrop?: (data: any) => void;
  onDragStart?: (data: any) => void;
  onDragEnd?: () => void;
}

export const useDragAndDrop = ({ onDrop, onDragStart, onDragEnd }: DragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<any>(null);
  const dropZoneRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (dragData && onDrop) {
        onDrop(dragData);
      }

      setIsDragging(false);
      setDragData(null);
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const element = dropZoneRef.current;
    if (element) {
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('drop', handleDrop);
      element.addEventListener('dragenter', handleDragEnter);
      element.addEventListener('dragleave', handleDragLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('drop', handleDrop);
        element.removeEventListener('dragenter', handleDragEnter);
        element.removeEventListener('dragleave', handleDragLeave);
      }
    };
  }, [dragData, onDrop]);

  const startDrag = (data: any) => {
    if (Platform.OS !== 'web') return;

    setDragData(data);
    setIsDragging(true);
    onDragStart?.(data);
  };

  const endDrag = () => {
    if (Platform.OS !== 'web') return;

    setIsDragging(false);
    setDragData(null);
    onDragEnd?.();
  };

  return {
    isDragging,
    dragData,
    dropZoneRef,
    startDrag,
    endDrag,
  };
};
