export const colors = {
  background: '#FFF9F9',
  card: '#FFFFFF',
  primary: '#FF8080',
  secondary: '#95C1D8',
  error: '#FF9999',
  success: '#95D895',
  border: '#F0E6E6',
  text: {
    primary: '#5D5D5D',
    secondary: '#8E8E8E',
    light: '#FFFFFF',
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3.84,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4.65,
    elevation: 2,
  },
};

export const borderRadius = {
  small: 16,
  medium: 20,
  large: 24,
  circle: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.primary,
  },
  h2: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: colors.text.primary,
  },
  caption: {
    fontSize: 14,
    color: colors.text.secondary,
  },
};

// Анимационные константы в стиле Zen
export const animation = {
  duration: {
    short: 200,
    medium: 300,
    long: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
};

// Отступы для безопасной зоны
export const safeArea = {
  top: 'padding-top: env(safe-area-inset-top)',
  bottom: 'padding-bottom: env(safe-area-inset-bottom)',
  left: 'padding-left: env(safe-area-inset-left)',
  right: 'padding-right: env(safe-area-inset-right)',
};

export const layout = {
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    height: 50,
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      ...shadows.small,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      ...shadows.small,
    },
    tertiary: {
      backgroundColor: 'transparent',
      borderRadius: borderRadius.large,
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
    },
  },
  icon: {
    small: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    medium: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    large: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
}; 