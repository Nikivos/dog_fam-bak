import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherEventCardProps {
  temperature: number;
  condition: string;
  nextEvent?: {
    title: string;
    time: string;
    icon: keyof typeof Ionicons.glyphMap;
  };
}

export const WeatherEventCard = ({ temperature, condition, nextEvent }: WeatherEventCardProps) => {
  return (
    <Card variant="elevated" style={styles.container}>
      <LinearGradient
        colors={[`${colors.primary}05`, `${colors.primary}10`]}
        style={styles.content}
      >
        <View style={styles.weatherRow}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="partly-sunny" size={24} color={colors.primary} />
          </View>
          <View style={styles.weatherInfo}>
            <Text style={styles.temperature}>{temperature}°C</Text>
            <Text style={styles.condition}>{condition}</Text>
          </View>
        </View>

        {nextEvent && (
          <>
            <View style={styles.divider} />
            <View style={styles.eventRow}>
              <View style={styles.eventIcon}>
                <Ionicons name={nextEvent.icon} size={24} color={colors.secondary} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{nextEvent.title}</Text>
                <Text style={styles.eventTime}>{nextEvent.time}</Text>
              </View>
            </View>
          </>
        )}
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  content: {
    padding: spacing.lg,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherInfo: {
    marginLeft: spacing.md,
  },
  temperature: {
    ...typography.h2,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  condition: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: 2,
  },
  eventTime: {
    ...typography.caption,
    color: colors.text.secondary,
  },
}); 