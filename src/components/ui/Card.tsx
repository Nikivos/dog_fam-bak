import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewProps,
  Animated,
  LayoutAnimation,
} from 'react-native';
import { colors, shadows, borderRadius, spacing } from '../../theme/theme';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'subtle';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
  onPress,
  disabled = false,
  loading = false,
  ...props
}) => {
  const [pressed, setPressed] = React.useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [loading]);

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'outlined':
      case 'subtle':
        return 'transparent';
      default:
        return colors.cardBackground;
    }
  };

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        disabled: disabled || loading,
        activeOpacity: 0.8,
      }
    : {};

  const cardStyle = [
    styles.card,
    {
      padding: spacing[padding],
      backgroundColor: getBackgroundColor(),
    },
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'subtle' && styles.subtle,
    pressed && styles.pressed,
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ];

  return (
    <Container {...containerProps}>
      <Animated.View
        style={[cardStyle, { transform: [{ scale }] }]}
        {...props}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar} />
          </View>
        ) : (
          children
        )}
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
  elevated: {
    ...shadows.medium,
    backgroundColor: colors.cardBackground,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  subtle: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.shadow,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    minHeight: 100,
  },
  loadingContainer: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBar: {
    width: '60%',
    height: 8,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.small,
  },
}); 