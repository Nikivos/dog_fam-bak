import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  Animated,
  View,
  ActivityIndicator,
} from 'react-native';
import { colors, borderRadius, typography, spacing } from '../theme/theme';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  style,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View 
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale }], opacity },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          styles[variant],
          styles[size],
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'tertiary' ? colors.primary : colors.text.light} 
            size={size === 'small' ? 'small' : 'small'}
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text 
              style={[
                styles.text,
                styles[`${variant}Text`],
                styles[`${size}Text`],
                isDisabled && styles.disabledText,
              ]}
            >
              {children}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.medium,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  // Sizes
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 32,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  // Text styles
  text: {
    ...typography.body1,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.text.light,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  tertiaryText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.text.light,
  },
  smallText: {
    ...typography.body2,
  },
  mediumText: {
    ...typography.body1,
  },
  largeText: {
    ...typography.h3,
  },
}); 