export const colors = {
  primary: '#3A5A98',
  background: '#FAFAF5',
  accent: '#F4D9A3',
  card: '#ECECEC',
  error: '#FF6B6B',
  text: {
    primary: '#333333',
    secondary: '#888888',
    light: '#FFFFFF',
  },
  border: '#ECECEC',
  success: '#4CAF50',
  warning: '#F4D9A3',
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const borderRadius = {
  small: 8,
  medium: 16,
  large: 24,
  circle: 999,
};

export const spacing = {
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
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
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