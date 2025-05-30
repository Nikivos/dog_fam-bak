import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, shadows, borderRadius } from '../theme/theme';

const { width } = Dimensions.get('window');

export const WalkScreen = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleStartWalk = async () => {
    setLoading(true);
    try {
      setIsWalking(true);
      // TODO: Start tracking location
    } catch (error) {
      console.error('Failed to start walk:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopWalk = async () => {
    setLoading(true);
    try {
      setIsWalking(false);
      // TODO: Stop tracking location
    } catch (error) {
      console.error('Failed to stop walk:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}ч ${minutes % 60}м`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Прогулка</Text>
        <Text style={styles.subtitle}>Следите за маршрутом</Text>
      </View>

      <View style={styles.mapContainer}>
        <Card variant="elevated" style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color={colors.text.secondary} />
            <Text style={styles.placeholderText}>Карта временно недоступна</Text>
          </View>
        </Card>
      </View>

      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Ionicons name="walk" size={24} color={colors.primary} />
            <Text style={styles.statsValue}>{distance.toFixed(1)} км</Text>
            <Text style={styles.statsLabel}>Расстояние</Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.statsCard}>
          <View style={styles.statsContent}>
            <Ionicons name="time" size={24} color={colors.primary} />
            <Text style={styles.statsValue}>{formatDuration(duration)}</Text>
            <Text style={styles.statsLabel}>Время</Text>
          </View>
        </Card>
      </View>

      <View style={styles.actionContainer}>
        <Button
          variant={isWalking ? "danger" : "primary"}
          size="large"
          loading={loading}
          onPress={isWalking ? handleStopWalk : handleStartWalk}
          icon={
            <Ionicons
              name={isWalking ? "stop" : "play"}
              size={24}
              color={colors.text.light}
            />
          }
          style={styles.actionButton}
        >
          {isWalking ? 'Закончить прогулку' : 'Начать прогулку'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  mapContainer: {
    flex: 1,
    padding: spacing.md,
  },
  mapCard: {
    flex: 1,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
  },
  placeholderText: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  statsCard: {
    flex: 1,
  },
  statsContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statsValue: {
    ...typography.h2,
    color: colors.text.primary,
    marginVertical: spacing.xs,
  },
  statsLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  actionContainer: {
    padding: spacing.md,
  },
  actionButton: {
    width: '100%',
  },
}); 