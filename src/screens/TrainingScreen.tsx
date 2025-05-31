import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextStyle,
  ViewStyle,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, shadows, borderRadius, typography, layout } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Команда "Сидеть"',
    description: 'Научите собаку садиться по команде',
    duration: 10,
    completed: false,
    icon: 'paw-outline',
    color: colors.primary,
  },
  {
    id: '2',
    name: 'Команда "Лежать"',
    description: 'Научите собаку ложиться по команде',
    duration: 15,
    completed: false,
    icon: 'bed-outline',
    color: colors.secondary,
  },
  {
    id: '3',
    name: 'Команда "Ко мне"',
    description: 'Тренировка подзыва собаки',
    duration: 20,
    completed: false,
    icon: 'walk-outline',
    color: colors.primary,
  },
];

export const TrainingScreen = () => {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [progress] = useState(new Animated.Value(0));

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercentage = (completedCount / exercises.length) * 100;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  const handleStartExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
  };

  const handleCompleteExercise = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      )
    );
    setActiveExercise(null);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, `${colors.primary}80`]}
          style={styles.header}
        >
          <Text style={styles.title}>Тренировки</Text>
          <Text style={styles.subtitle}>Развивайте навыки вашего питомца</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Card variant="elevated" style={styles.progressCard}>
            <LinearGradient
              colors={[`${colors.primary}05`, `${colors.primary}10`]}
              style={styles.progressContent}
            >
              <View style={styles.progressHeader}>
                <View style={styles.progressTitleContainer}>
                  <View style={[styles.progressIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <Ionicons name="trophy" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.progressTitle}>Прогресс</Text>
                </View>
                <Text style={styles.progressValue}>{progressPercentage.toFixed(0)}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { 
                        width: progressWidth,
                        backgroundColor: progressPercentage === 100 ? colors.success : colors.primary 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedCount} из {exercises.length} упражнений выполнено
                </Text>
              </View>
            </LinearGradient>
          </Card>

          <View style={styles.exercisesContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={[`${colors.primary}15`, `${colors.primary}05`]}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="fitness" size={20} color={colors.primary} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Упражнения</Text>
              </View>
            </View>

            {exercises.map(exercise => (
              <Card
                key={exercise.id}
                variant={exercise.completed ? 'subtle' : 'elevated'}
                style={styles.exerciseCard}
              >
                <LinearGradient
                  colors={[
                    exercise.completed ? `${colors.success}05` : `${exercise.color}05`,
                    exercise.completed ? `${colors.success}10` : `${exercise.color}10`
                  ]}
                  style={styles.exerciseContent}
                >
                  <View style={[
                    styles.exerciseIcon,
                    { backgroundColor: exercise.completed ? `${colors.success}15` : `${exercise.color}15` }
                  ]}>
                    <Ionicons
                      name={exercise.icon}
                      size={24}
                      color={exercise.completed ? colors.success : exercise.color}
                    />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDescription}>
                      {exercise.description}
                    </Text>
                    <View style={styles.exerciseMeta}>
                      <View style={styles.exerciseMetaItem}>
                        <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                        <Text style={styles.exerciseMetaText}>
                          {exercise.duration} минут
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Button
                    variant={exercise.completed ? 'tertiary' : 'primary'}
                    size="small"
                    onPress={() =>
                      exercise.completed
                        ? null
                        : handleStartExercise(exercise)
                    }
                    disabled={exercise.completed}
                    icon={
                      exercise.completed 
                        ? <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        : <Ionicons name="play" size={20} color={colors.text.light} />
                    }
                  >
                    {exercise.completed ? 'Выполнено' : 'Начать'}
                  </Button>
                </LinearGradient>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      {activeExercise && (
        <View style={styles.activeExerciseOverlay}>
          <Card variant="elevated" style={styles.activeExerciseCard}>
            <LinearGradient
              colors={[`${activeExercise.color}05`, `${activeExercise.color}10`]}
              style={styles.activeExerciseContent}
            >
              <View style={styles.activeExerciseHeader}>
                <View style={[styles.activeExerciseIcon, { backgroundColor: `${activeExercise.color}15` }]}>
                  <Ionicons name={activeExercise.icon} size={24} color={activeExercise.color} />
                </View>
                <Text style={styles.activeExerciseTitle}>
                  {activeExercise.name}
                </Text>
              </View>
              <Text style={styles.activeExerciseDescription}>
                {activeExercise.description}
              </Text>
              <View style={styles.activeExerciseActions}>
                <Button
                  variant="tertiary"
                  size="medium"
                  onPress={() => setActiveExercise(null)}
                  icon={<Ionicons name="close-outline" size={20} color={colors.text.secondary} />}
                >
                  Отменить
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onPress={() => handleCompleteExercise(activeExercise.id)}
                  icon={<Ionicons name="checkmark" size={20} color={colors.text.light} />}
                >
                  Завершить
                </Button>
              </View>
            </LinearGradient>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  } as ViewStyle,
  content: {
    flex: 1,
    marginTop: -spacing.xl,
    padding: spacing.md,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    backgroundColor: colors.background,
  } as ViewStyle,
  title: {
    ...typography.h1,
    color: colors.text.light,
    marginBottom: spacing.xs,
  } as TextStyle,
  subtitle: {
    ...typography.body,
    color: colors.text.light,
    opacity: 0.9,
  } as TextStyle,
  progressCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  } as ViewStyle,
  progressContent: {
    padding: spacing.md,
  } as ViewStyle,
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  } as ViewStyle,
  progressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  } as ViewStyle,
  progressTitle: {
    ...typography.h2,
  } as TextStyle,
  progressValue: {
    ...typography.h2,
    color: colors.primary,
  } as TextStyle,
  progressBarContainer: {
    marginTop: spacing.sm,
  } as ViewStyle,
  progressBar: {
    height: 8,
    backgroundColor: `${colors.primary}15`,
    borderRadius: borderRadius.small,
    overflow: 'hidden',
  } as ViewStyle,
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.small,
  } as ViewStyle,
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  } as TextStyle,
  exercisesContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  sectionHeader: {
    marginBottom: spacing.md,
  } as ViewStyle,
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  } as ViewStyle,
  sectionTitle: {
    ...typography.h2,
  } as TextStyle,
  exerciseCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  } as ViewStyle,
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  exerciseInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  } as ViewStyle,
  exerciseName: {
    ...typography.body,
    fontWeight: '500',
  } as TextStyle,
  exerciseDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  } as TextStyle,
  exerciseMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  } as ViewStyle,
  exerciseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  exerciseMetaText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  } as TextStyle,
  activeExerciseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.md,
  } as ViewStyle,
  activeExerciseCard: {
    overflow: 'hidden',
  } as ViewStyle,
  activeExerciseContent: {
    padding: spacing.lg,
  } as ViewStyle,
  activeExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  } as ViewStyle,
  activeExerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  } as ViewStyle,
  activeExerciseTitle: {
    ...typography.h2,
    flex: 1,
  } as TextStyle,
  activeExerciseDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  } as TextStyle,
  activeExerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  } as ViewStyle,
}); 