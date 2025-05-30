export const colors = {
  primary: '#A8D8D5', // мятный
  secondary: '#F5E6D3', // тёплый бежевый
  tertiary: '#2F3542', // графитовый
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  text: {
    primary: '#2F3542',
    secondary: '#6C7A89',
    light: '#FFFFFF'
  },
  success: '#95E1D3',
  error: '#FF9F9F',
  warning: '#FFE0B2',
  shadow: 'rgba(47, 53, 66, 0.08)',
  border: 'rgba(47, 53, 66, 0.12)',
  skeleton: '#F0F2F5'
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5
  }
};

export const borderRadius = {
  small: 12,
  medium: 16,
  large: 24,
  circle: 9999
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

export const typography = {
  h1: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    lineHeight: 34
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 30
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 26
  },
  body1: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22
  },
  body2: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16
  }
}; 