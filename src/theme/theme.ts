export const colors = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  primary: '#007AFF',
  secondary: '#5856D6',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  border: '#E5E5EA',
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    light: '#FFFFFF',
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  circle: 9999,
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
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
  window: {
    width: 375,
    height: 812,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: colors.card,
    borderRadius: borderRadius.medium,
    padding: spacing.md,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
  },
  button: {
    height: 48,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
  },
  icon: {
    size: {
      small: 16,
      medium: 24,
      large: 32,
    },
  },
}; 