import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { WalkStackParamList } from '../types/navigation';
import { colors, spacing, typography } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type WalkDetailsScreenRouteProp = RouteProp<WalkStackParamList, 'WalkDetails'>;

type Walk = {
  id: string;
  date: string;
  duration: number;
  distance: number;
  petId: string;
  avgSpeed: number;
  steps: number;
  route: {
    startPoint: string;
    endPoint: string;
  };
  weather: {
    temperature: number;
    condition: string;
  };
};

const mockWalk: Walk = {
  id: '1',
  date: '2024-03-20T10:00:00Z',
  duration: 45,
  distance: 3.2,
  petId: '1',
  avgSpeed: 4.3,
  steps: 4500,
  route: {
    startPoint: 'Парк Горького',
    endPoint: 'Парк Горького',
  },
  weather: {
    temperature: 18,
    condition: 'Солнечно',
  },
};

export const WalkDetailsScreen = () => {
  const route = useRoute<WalkDetailsScreenRouteProp>();
  const { walkId } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} минут`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ч ${remainingMinutes} мин`;
  };

  const StatCard = ({ 
    icon, 
    value, 
    label 
  }: { 
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    label: string;
  }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(mockWalk.date)}</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="time"
          value={formatDuration(mockWalk.duration)}
          label="Длительность"
        />
        <StatCard
          icon="map"
          value={`${mockWalk.distance.toFixed(1)} км`}
          label="Расстояние"
        />
        <StatCard
          icon="speedometer"
          value={`${mockWalk.avgSpeed.toFixed(1)} км/ч`}
          label="Ср. скорость"
        />
        <StatCard
          icon="footsteps"
          value={mockWalk.steps.toString()}
          label="Шагов"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Маршрут</Text>
        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.routeText}>{mockWalk.route.startPoint}</Text>
          </View>
          <View style={styles.routePoint}>
            <Ionicons name="flag" size={20} color={colors.primary} />
            <Text style={styles.routeText}>{mockWalk.route.endPoint}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Погода</Text>
        <View style={styles.weatherInfo}>
          <Ionicons 
            name={mockWalk.weather.condition === 'Солнечно' ? 'sunny' : 'cloud'} 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.weatherText}>
            {mockWalk.weather.temperature}°C, {mockWalk.weather.condition}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  date: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: typography.body2.fontSize,
    fontWeight: '400',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  routeInfo: {
    gap: spacing.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  routeText: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    color: colors.text.primary,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weatherText: {
    fontSize: typography.body1.fontSize,
    fontWeight: '400',
    color: colors.text.primary,
  },
}); 