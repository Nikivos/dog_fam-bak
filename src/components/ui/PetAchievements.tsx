import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme/theme';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';

interface Achievement {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  progress: number;
  color: string;
  total: number;
  current: number;
}

interface PetAchievementsProps {
  achievements: Achievement[];
}

export const PetAchievements = ({ achievements }: PetAchievementsProps) => {
  const renderAchievement = (achievement: Achievement, index: number) => {
    const progressStyle = useAnimatedStyle(() => {
      return {
        width: withDelay(
          index * 100,
          withSpring(`${achievement.progress * 100}%` as any, {
            damping: 15,
            stiffness: 100,
          })
        ),
      };
    });

    const iconStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withDelay(
              index * 100,
              withSequence(
                withSpring(1.2, { damping: 10 }),
                withSpring(1, { damping: 15 })
              )
            ),
          },
        ],
      };
    });

    return (
      <Card key={achievement.id} variant="subtle" style={styles.achievementCard}>
        <View style={styles.achievementHeader}>
          <Animated.View style={[
            styles.achievementIcon,
            { backgroundColor: `${achievement.color}15` },
            iconStyle
          ]}>
            <Ionicons name={achievement.icon} size={24} color={achievement.color} />
          </Animated.View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementProgress}>
              {achievement.current} / {achievement.total}
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={[`${achievement.color}15`, `${achievement.color}05`]}
            style={styles.progressBackground}
          />
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: achievement.color },
              progressStyle,
            ]}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Достижения</Text>
        <Text style={styles.subtitle}>
          {achievements.filter(a => a.progress === 1).length} из {achievements.length} выполнено
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {achievements.map((achievement, index) => renderAchievement(achievement, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  achievementCard: {
    width: 200,
    padding: spacing.md,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  achievementTitle: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: 2,
  },
  achievementProgress: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
}); 