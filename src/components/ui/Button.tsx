import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  View,
  Animated,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/theme';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  title: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  title,
  style,
  disabled,
  onPress,
  ...props
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'tertiary':
        return 'transparent';
      case 'danger':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.secondary;
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.text.light;
      case 'secondary':
        return colors.text.primary;
      case 'tertiary':
        return colors.primary;
      default:
        return colors.text.light;
    }
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      paddingVertical: spacing[size === 'small' ? 'xs' : size === 'medium' ? 'sm' : 'md'],
      paddingHorizontal: spacing[size === 'small' ? 'sm' : size === 'medium' ? 'md' : 'lg'],
    },
    variant === 'tertiary' && styles.tertiary,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        style={buttonStyles}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'tertiary' ? colors.primary : colors.text.light}
            size={size === 'small' ? 'small' : 'small'}
          />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              variant={size === 'small' ? 'body2' : size === 'medium' ? 'body1' : 'h3'}
              style={[{ color: getTextColor() }]}
            >
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
}); 