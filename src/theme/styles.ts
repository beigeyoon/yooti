import { StyleSheet, Platform } from 'react-native';

// 색상 상수
export const COLORS = {
  primary: '#000000',
  secondary: '#374151',
  tertiary: '#6b7280',
  muted: '#9ca3af',
  background: '#f8fafc',
  white: '#ffffff',
  border: '#d1d5db',
  inputBackground: '#f3f4f6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;

// 간격 상수
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// 폰트 크기 상수
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
} as const;

// 폰트 굵기 상수
export const FONT_WEIGHT = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// 공통 스타일
export const COMMON_STYLES = StyleSheet.create({
  // 레이아웃
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 텍스트
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  bodyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.tertiary,
    lineHeight: 16,
  },

  // 입력 필드
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZE.lg,
    backgroundColor: COLORS.white,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      ':focus': {
        borderColor: COLORS.primary,
        borderWidth: 2,
      },
    }),
  },
  inputContainer: {
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // 버튼 (일반 버튼)
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 8, // 더 각진 모양
    borderWidth: 0, // border 제거
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
      ':hover': {
        opacity: 0.8,
      },
      ':active': {
        opacity: 0.6,
      },
    }),
  },
  // 칩 버튼 (타입/그룹 선택용)
  chipButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 25, // 둥근 칩 형태
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
      ':hover': {
        opacity: 0.8,
      },
      ':active': {
        opacity: 0.6,
      },
    }),
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  buttonTextPrimary: {
    color: COLORS.white,
  },
  buttonTextSecondary: {
    color: COLORS.secondary,
  },

  // 카드
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.sm,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
      ':hover': {
        shadowOpacity: 0.15,
        shadowRadius: 6,
        transform: [{ translateY: -1 }],
      },
    }),
  },

  // 섹션
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },

  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: SPACING.xxl,
    borderRadius: SPACING.lg,
    width: 320,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // 빈 상태
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.tertiary,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.muted,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

// 유틸리티 함수
export const createButtonStyle = (isSelected: boolean) => ({
  ...COMMON_STYLES.button,
  ...(isSelected ? COMMON_STYLES.buttonPrimary : COMMON_STYLES.buttonSecondary),
});

export const createButtonTextStyle = (isSelected: boolean) => ({
  ...COMMON_STYLES.buttonText,
  ...(isSelected ? COMMON_STYLES.buttonTextPrimary : COMMON_STYLES.buttonTextSecondary),
});

// 칩 버튼용 유틸리티 함수
export const createChipButtonStyle = (isSelected: boolean) => ({
  ...COMMON_STYLES.chipButton,
  ...(isSelected ? COMMON_STYLES.buttonPrimary : COMMON_STYLES.buttonSecondary),
});

export const createChipButtonTextStyle = (isSelected: boolean) => ({
  ...COMMON_STYLES.buttonText,
  ...(isSelected ? COMMON_STYLES.buttonTextPrimary : COMMON_STYLES.buttonTextSecondary),
});

// DateInput 관련 스타일
export const DATE_INPUT_STYLES = StyleSheet.create({
  // 앱용 X 버튼 스타일
  appXButton: {
    position: 'absolute',
    top: '50%',
    right: 8,
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  // 앱용 X 버튼 텍스트 스타일
  appXButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

// 웹용 DateInput 스타일 (CSS 객체)
export const DATE_INPUT_WEB_STYLES = {
  webInput: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#f3f4f6',
    color: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '20px',
    textAlign: 'center',
    boxSizing: 'border-box',
    height: '40px',
    cursor: 'pointer',
  },

  webTextOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 14,
    pointerEvents: 'none',
    zIndex: 1,
  },

  webXButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// 웹 전용 유틸리티
export const getWebStyles = () => {
  if (Platform.OS === 'web') {
    return {
      // 웹에서만 사용할 스타일들
      focusable: {
        outline: 'none',
      },
      selectable: {
        userSelect: 'text',
      },
      draggable: {
        cursor: 'grab',
      },
    };
  }
  return {};
};
