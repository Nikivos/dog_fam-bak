import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewProps, 
  Pressable, 
  Animated, 
  LayoutAnimation 
} from 'react-native';
import { colors, shadows, borderRadius, spacing } from '../theme/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'subtle';
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
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [loading]);

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const Container = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        disabled,
      }
    : {};

  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'subtle' && styles.subtle,
    { padding: spacing[padding] },
    pressed && styles.pressed,
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ];

  return (
    <Container {...containerProps}>
      <Animated.View
        style={[
          cardStyle,
          { transform: [{ scale: scaleAnim }] },
        ]}
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
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    ...shadows.small,
    borderWidth: 1,
    borderColor: `${colors.primary}10`,
    backgroundColor: colors.card,
  },
  outlined: {
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    backgroundColor: colors.card,
  },
  subtle: {
    backgroundColor: `${colors.primary}05`,
    borderWidth: 1,
    borderColor: `${colors.primary}10`,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.995 }],
  },
  disabled: {
    opacity: 0.6,
  },
  loading: {
    minHeight: 100,
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBar: {
    width: '60%',
    height: 6,
    backgroundColor: `${colors.primary}20`,
    borderRadius: borderRadius.small,
  },
}); 