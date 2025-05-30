import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/theme';

interface PulseButtonProps {
  onPress: () => void;
  isActive?: boolean;
  style?: ViewStyle;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: number;
}

export const PulseButton: React.FC<PulseButtonProps> = ({
  onPress,
  isActive = false,
  style,
  icon,
  color = colors.primary,
  size = 64,
}) => {
  const pulse1 = useSharedValue(1);
  const pulse2 = useSharedValue(1);
  const pulse3 = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      pulse1.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );

      pulse2.value = withDelay(
        333,
        withRepeat(
          withSequence(
            withTiming(1.5, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          true
        )
      );

      pulse3.value = withDelay(
        666,
        withRepeat(
          withSequence(
            withTiming(1.5, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          true
        )
      );
    } else {
      cancelAnimation(pulse1);
      cancelAnimation(pulse2);
      cancelAnimation(pulse3);
      pulse1.value = 1;
      pulse2.value = 1;
      pulse3.value = 1;
    }
  }, [isActive]);

  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1.value }],
    opacity: isActive ? withTiming(0.7) : withTiming(0),
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse2.value }],
    opacity: isActive ? withTiming(0.5) : withTiming(0),
  }));

  const pulseStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse3.value }],
    opacity: isActive ? withTiming(0.3) : withTiming(0),
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.pulse, pulseStyle1, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
      <Animated.View style={[styles.pulse, pulseStyle2, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
      <Animated.View style={[styles.pulse, pulseStyle3, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
        onPress={onPress}
      >
        <Ionicons name={icon} size={size / 2} color={colors.text.light} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 