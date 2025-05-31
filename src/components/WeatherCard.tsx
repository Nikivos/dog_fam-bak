import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/Text';
import { useTheme } from '../theme/ThemeContext';

interface WeatherCardProps {
  temperature?: number;
  condition?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature = 18,
  condition = 'Облачно'
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        ...shadows.medium,
      }
    ]}>
      <View style={[styles.content, { gap: spacing.md }]}>
        <View style={styles.header}>
          <Text variant="h3">Погода для прогулки</Text>
          <Ionicons name="partly-sunny" size={24} color={colors.warning} />
        </View>
        <View style={styles.weatherInfo}>
          <View style={styles.temperature}>
            <Text variant="h2">+{temperature}°</Text>
            <Text variant="body2" style={{ color: colors.text.secondary }}>
              {condition}
            </Text>
          </View>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={20} color={colors.primary} />
              <Text variant="body2">65%</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer" size={20} color={colors.primary} />
              <Text variant="body2">760 мм</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="leaf" size={20} color={colors.primary} />
              <Text variant="body2">3 м/с</Text>
            </View>
          </View>
        </View>
        <Text variant="body2" style={{ color: colors.success }}>
          Отличное время для прогулки!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: {
    gap: 4,
  },
  details: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 