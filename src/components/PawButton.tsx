import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, borderRadius } from '../theme/theme';

interface PawButtonProps extends TouchableOpacityProps {
  size?: number;
  color?: string;
  loading?: boolean;
  variant?: 'filled' | 'outlined';
}

export const PawButton: React.FC<PawButtonProps> = ({
  size = 56,
  color = colors.primary,
  style,
  loading = false,
  disabled = false,
  variant = 'filled',
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 1,
        duration: 200,
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
      Animated.timing(rotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      bounce.setValue(0);
    }
  }, [loading]);

  const animatedStyle = {
    transform: [
      { scale },
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '15deg'],
        }),
      },
      {
        translateY: bounce.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View 
      style={[
        styles.container, 
        animatedStyle, 
        { width: size, height: size },
        isDisabled && styles.disabled,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'filled' ? { backgroundColor: color } : styles.outlined,
          variant === 'outlined' && { borderColor: color },
          { width: size, height: size },
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outlined' ? color : colors.text.light} 
            size="small"
          />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons 
              name="paw" 
              size={size * 0.5} 
              color={variant === 'outlined' ? color : colors.text.light} 
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...shadows.medium,
  },
  button: {
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 