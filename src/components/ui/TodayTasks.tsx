import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/theme';
import { Card } from './Card';
import { SearchBar } from './SearchBar';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../../theme/ThemeContext';

export interface Task {
  id: string;
  title: string;
  time: string;
  type: 'walk' | 'feeding' | 'medical' | 'training';
  completed: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface TaskItemProps {
  task: Task;
  onPress: (task: Task) => void;
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
}

interface TodayTasksProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onAddTask: () => void;
}

const TaskItem = ({ task, onPress, onComplete, onDelete }: TaskItemProps) => {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const { colors } = useTheme();

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = Math.min(0, Math.max(-200, event.translationX));
    })
    .onEnd((event) => {
      const shouldComplete = translateX.value < -100;
      const shouldDelete = translateX.value < -150;

      if (shouldDelete) {
        opacity.value = withTiming(0, {}, () => {
          runOnJS(onDelete)(task);
        });
      } else if (shouldComplete) {
        translateX.value = withSpring(0);
        runOnJS(onComplete)(task);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const getTaskColor = (type: Task['type']) => {
    switch (type) {
      case 'walk':
        return colors.primary;
      case 'feeding':
        return colors.warning;
      case 'medical':
        return colors.success;
      case 'training':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'walk':
        return 'map';
      case 'feeding':
        return 'restaurant';
      case 'medical':
        return 'medical';
      case 'training':
        return 'fitness';
      default:
        return 'calendar';
    }
  };

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    onPress(task);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const actionStyle = useAnimatedStyle(() => {
    const progress = Math.abs(translateX.value) / 200;
    return {
      opacity: progress,
      transform: [{ scale: 0.8 + (0.2 * progress) }],
    };
  });

  return (
    <View style={styles.taskItemContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.taskWrapper, animatedStyle]}>
          <View style={styles.timelineIndicator}>
            <View style={[styles.timelineDot, { backgroundColor: getTaskColor(task.type) }]} />
            <View style={styles.timelineLine} />
          </View>
          <TouchableOpacity
            style={styles.taskItem}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Card variant="subtle">
              <View style={styles.taskContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${getTaskColor(task.type)}08` }]}>
                  <Ionicons name={getTaskIcon(task.type)} size={24} color={getTaskColor(task.type)} />
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
                {task.completed && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                )}
              </View>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
      <Animated.View style={[styles.actionButtons, actionStyle]} pointerEvents="none">
        <View style={[styles.actionButton, { backgroundColor: colors.success }]}>
          <Ionicons name="checkmark" size={20} color={colors.background} />
        </View>
        <View style={[styles.actionButton, { backgroundColor: colors.error }]}>
          <Ionicons name="trash" size={20} color={colors.background} />
        </View>
      </Animated.View>
    </View>
  );
};

export const TodayTasks: React.FC<TodayTasksProps> = ({
  tasks,
  onTaskPress,
  onAddTask,
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComplete = useCallback((task: Task) => {
    // TODO: Implement task completion
  }, []);

  const handleDelete = useCallback((task: Task) => {
    // TODO: Implement task deletion
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Задачи на сегодня
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: `${colors.primary}15` }]}
          onPress={onAddTask}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        placeholder="Поиск задач"
      />

      <View style={styles.taskList}>
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onPress={onTaskPress}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        ))}
      </View>
    </Card>
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
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.h2.lineHeight,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  taskItemContainer: {
    marginBottom: spacing.md,
  },
  taskWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.circle,
    marginBottom: spacing.xxs,
  },
  timelineLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.border,
  },
  taskItem: {
    flex: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.body1.lineHeight,
    marginBottom: spacing.xxs,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskTime: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: typography.caption.lineHeight,
    color: colors.text.secondary,
  },
  actionButtons: {
    position: 'absolute',
    right: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 