import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../../theme/ThemeContext';

interface WeatherCardProps {
  temperature: number;
  condition: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
}) => {
  const { colors, shadows } = useTheme();

  const getWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'sunny';
      case 'cloudy':
        return 'cloudy';
      case 'rainy':
        return 'rainy';
      case 'snowy':
        return 'snow';
      default:
        return 'partly-sunny';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, shadows.medium]}>
      <View style={styles.content}>
        <Ionicons name={getWeatherIcon()} size={48} color={colors.primary} />
        <View style={styles.info}>
          <Text variant="h2" style={{ color: colors.text.primary }}>
            {temperature}°C
          </Text>
          <Text variant="body1" style={{ color: colors.text.secondary }}>
            {condition}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 16,
  },
}); 