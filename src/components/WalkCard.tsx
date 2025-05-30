import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/theme';
import { Walk } from '../types/walk';
import MapView, { Polyline } from 'react-native-maps-expo';

interface WalkCardProps {
  walk: Walk;
  onPress?: () => void;
}

export const WalkCard: React.FC<WalkCardProps> = ({ walk, onPress }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    }
    return `${minutes} мин`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} м`;
    }
    return `${(meters / 1000).toFixed(2)} км`;
  };

  const formatSpeed = (mps: number): string => {
    const kph = mps * 3.6;
    return `${kph.toFixed(1)} км/ч`;
  };

  const startDate = new Date(walk.startTime);

  if (!walk.path || walk.path.length === 0) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.header}>
          <Text style={styles.date}>
            {format(startDate, 'd MMMM', { locale: ru })}
          </Text>
          <Text style={styles.time}>
            {format(startDate, 'HH:mm')}
          </Text>
        </View>

        <View style={[styles.mapContainer, styles.emptyMap]}>
          <Text style={styles.emptyMapText}>Нет данных о маршруте</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.statValue}>{formatDuration(walk.duration)}</Text>
            <Text style={styles.statLabel}>Время</Text>
          </View>

          <View style={styles.stat}>
            <Ionicons name="footsteps" size={24} color={colors.text.secondary} />
            <Text style={styles.statValue}>{formatDistance(walk.distance)}</Text>
            <Text style={styles.statLabel}>Расстояние</Text>
          </View>

          <View style={styles.stat}>
            <Ionicons name="speedometer-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.statValue}>{formatSpeed(walk.averageSpeed)}</Text>
            <Text style={styles.statLabel}>Скорость</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {format(startDate, 'd MMMM', { locale: ru })}
        </Text>
        <Text style={styles.time}>
          {format(startDate, 'HH:mm')}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: walk.path[0].latitude,
            longitude: walk.path[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Polyline
            coordinates={walk.path}
            strokeColor={colors.primary}
            strokeWidth={3}
          />
        </MapView>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.statValue}>{formatDuration(walk.duration)}</Text>
          <Text style={styles.statLabel}>Время</Text>
        </View>

        <View style={styles.stat}>
          <Ionicons name="footsteps" size={24} color={colors.text.secondary} />
          <Text style={styles.statValue}>{formatDistance(walk.distance)}</Text>
          <Text style={styles.statLabel}>Расстояние</Text>
        </View>

        <View style={styles.stat}>
          <Ionicons name="speedometer-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.statValue}>{formatSpeed(walk.averageSpeed)}</Text>
          <Text style={styles.statLabel}>Скорость</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  time: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  mapContainer: {
    height: 150,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyMap: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyMapText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
}); 