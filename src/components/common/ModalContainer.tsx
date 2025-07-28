import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { COMMON_STYLES } from '../../theme/styles';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export default function ModalContainer({
  visible,
  onClose,
  children,
  width = 320,
}: ModalContainerProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={COMMON_STYLES.modalOverlay}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
          onPress={onClose}
        />
        <View style={COMMON_STYLES.modalContainer}>
          <View style={[COMMON_STYLES.modalContent, { width }]}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}
