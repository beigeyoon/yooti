import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { COMMON_STYLES, COLORS, SPACING } from '../../theme/styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  destructive = false,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={[
            COMMON_STYLES.card,
            {
              backgroundColor: COLORS.white,
              padding: SPACING.lg,
              borderRadius: SPACING.md,
              maxWidth: 400,
              width: '100%',
            },
          ]}
        >
          <Text
            style={[
              COMMON_STYLES.title,
              {
                marginBottom: SPACING.sm,
                textAlign: 'center',
              },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              COMMON_STYLES.bodyText,
              {
                marginBottom: SPACING.lg,
                textAlign: 'center',
                color: COLORS.secondary,
              },
            ]}
          >
            {message}
          </Text>
          <View style={[COMMON_STYLES.row, { gap: SPACING.md }]}>
            <TouchableOpacity
              onPress={onCancel}
              style={[
                COMMON_STYLES.button,
                {
                  flex: 1,
                  backgroundColor: COLORS.border,
                },
              ]}
            >
              <Text style={[COMMON_STYLES.buttonText, { color: COLORS.secondary }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                COMMON_STYLES.button,
                {
                  flex: 1,
                  backgroundColor: destructive ? COLORS.error : COLORS.primary,
                },
              ]}
            >
              <Text style={[COMMON_STYLES.buttonText, { color: COLORS.white }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
