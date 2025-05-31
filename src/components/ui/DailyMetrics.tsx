import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Card } from './Card';
import { spacing, borderRadius, typography } from '../../theme/theme';

interface MetricProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  progress: number;
  color: string;
}

interface DailyMetricsProps {
  metrics: {
    walks: MetricProps;
    feeding: MetricProps;
    health: MetricProps;
  };
}

export const DailyMetrics: React.FC<DailyMetricsProps> = ({ metrics }) => {
  const { colors } = useTheme();

  const renderMetric = (metric: MetricProps) => (
    <View style={styles.metricContainer}>
      <View style={styles.metricHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
          <Ionicons name={metric.icon} size={20} color={metric.color} />
        </View>
        <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>{metric.label}</Text>
      </View>
      <Text style={[styles.metricValue, { color: colors.text.primary }]}>{metric.value}</Text>
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { backgroundColor: `${metric.color}15` }
          ]}
        >
          <View 
            style={[
              styles.progressFill,
              { 
                backgroundColor: metric.color,
                width: `${Math.min(100, Math.max(0, metric.progress * 100))}%`
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  return (
    <Card variant="elevated" style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Сегодня</Text>
      <View style={styles.metricsContainer}>
        {renderMetric(metrics.walks)}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {renderMetric(metrics.feeding)}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {renderMetric(metrics.health)}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricContainer: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typography.caption,
    marginBottom: spacing.xxs,
  },
  metricValue: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    width: '80%',
  },
  progressBar: {
    height: 4,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: spacing.sm,
  },
}); 