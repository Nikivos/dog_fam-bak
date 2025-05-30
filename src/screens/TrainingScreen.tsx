import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  completed: boolean;
  icon: keyof typeof Ionicons.glyphMap;
}

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Команда "Сидеть"',
    description: 'Научите собаку садиться по команде',
    duration: 10,
    completed: false,
    icon: 'paw',
  },
  {
    id: '2',
    name: 'Команда "Лежать"',
    description: 'Научите собаку ложиться по команде',
    duration: 15,
    completed: false,
    icon: 'bed',
  },
  {
    id: '3',
    name: 'Команда "Ко мне"',
    description: 'Тренировка подзыва собаки',
    duration: 20,
    completed: false,
    icon: 'walk',
  },
];

export const TrainingScreen = () => {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

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

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Тренировки</Text>
          <Text style={styles.subtitle}>Развивайте навыки вашего питомца</Text>
        </View>

        <Card variant="elevated" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Прогресс</Text>
            <Text style={styles.progressValue}>{progress.toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount} из {exercises.length} упражнений выполнено
          </Text>
        </Card>

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Упражнения</Text>
          {exercises.map(exercise => (
            <Card
              key={exercise.id}
              variant={exercise.completed ? 'subtle' : 'elevated'}
              style={styles.exerciseCard}
            >
              <View style={styles.exerciseContent}>
                <View style={styles.exerciseIcon}>
                  <Ionicons
                    name={exercise.icon}
                    size={24}
                    color={exercise.completed ? colors.success : colors.primary}
                  />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                  <Text style={styles.exerciseDuration}>
                    {exercise.duration} минут
                  </Text>
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
                style={styles.exerciseButton}
              >
                {exercise.completed ? 'Выполнено' : 'Начать'}
              </Button>
            </Card>
          ))}
        </View>
      </ScrollView>

      {activeExercise && (
        <View style={styles.activeExerciseOverlay}>
          <Card variant="elevated" style={styles.activeExerciseCard}>
            <Text style={styles.activeExerciseTitle}>
              {activeExercise.name}
            </Text>
            <Text style={styles.activeExerciseDescription}>
              {activeExercise.description}
            </Text>
            <View style={styles.activeExerciseActions}>
              <Button
                variant="tertiary"
                size="medium"
                onPress={() => setActiveExercise(null)}
                style={styles.actionButton}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                size="medium"
                onPress={() => handleCompleteExercise(activeExercise.id)}
                style={styles.actionButton}
              >
                Завершить
              </Button>
            </View>
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressCard: {
    margin: spacing.md,
    padding: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  progressValue: {
    ...typography.h2,
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.secondary + '40',
    borderRadius: borderRadius.small,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  exercisesContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  exerciseCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  exerciseContent: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.small,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  exerciseDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  exerciseDuration: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  exerciseButton: {
    alignSelf: 'flex-start',
  },
  activeExerciseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  activeExerciseCard: {
    padding: spacing.lg,
  },
  activeExerciseTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  activeExerciseDescription: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  activeExerciseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  actionButton: {
    minWidth: 120,
  },
}); 