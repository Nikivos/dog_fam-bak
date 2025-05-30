import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { Card } from './Card';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { ModalScreen } from './ModalScreen';
import { Meal } from '../data/feedingStorage';

interface MealFormProps {
  petId: string;
  dailyCalories: number;
  onSubmit: (meal: Meal) => void;
  onClose: () => void;
  initialValues?: Meal;
}

export const MealForm: React.FC<MealFormProps> = ({
  petId,
  dailyCalories,
  onSubmit,
  onClose,
  initialValues,
}) => {
  const [meal, setMeal] = useState<Partial<Meal>>(
    initialValues || {
      type: 'breakfast',
      time: '08:00',
      amount: 0,
      calories: 0,
      completed: false,
    }
  );

  const handleSubmit = () => {
    if (!meal.time || !meal.amount || !meal.calories) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    onSubmit({
      id: initialValues?.id || Date.now().toString(),
      petId,
      type: meal.type || 'breakfast',
      time: meal.time,
      amount: Number(meal.amount),
      calories: Number(meal.calories),
      completed: meal.completed || false,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const renderActions = () => (
    <View style={styles.actionButtons}>
      <Button variant="tertiary" size="medium" onPress={onClose} style={styles.actionButton}>
        Отмена
      </Button>
      <Button variant="primary" size="medium" onPress={handleSubmit} style={styles.actionButton}>
        {initialValues ? 'Сохранить' : 'Добавить'}
      </Button>
    </View>
  );

  return (
    <ModalScreen
      title={initialValues ? 'Редактировать прием пищи' : 'Новый прием пищи'}
      onClose={onClose}
      actions={renderActions()}
    >
      <View style={styles.field}>
        <Text style={styles.label}>Тип приема пищи</Text>
        <View style={styles.optionsContainer}>
          <Button
            variant={meal.type === 'breakfast' ? 'primary' : 'tertiary'}
            size="small"
            onPress={() => setMeal(prev => ({ ...prev, type: 'breakfast' }))}
            icon={<Ionicons name="sunny" size={20} color={meal.type === 'breakfast' ? colors.text.light : colors.primary} />}
          >
            Завтрак
          </Button>
          <Button
            variant={meal.type === 'lunch' ? 'primary' : 'tertiary'}
            size="small"
            onPress={() => setMeal(prev => ({ ...prev, type: 'lunch' }))}
            icon={<Ionicons name="partly-sunny" size={20} color={meal.type === 'lunch' ? colors.text.light : colors.primary} />}
          >
            Обед
          </Button>
          <Button
            variant={meal.type === 'dinner' ? 'primary' : 'tertiary'}
            size="small"
            onPress={() => setMeal(prev => ({ ...prev, type: 'dinner' }))}
            icon={<Ionicons name="moon" size={20} color={meal.type === 'dinner' ? colors.text.light : colors.primary} />}
          >
            Ужин
          </Button>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Время</Text>
        <TextInput
          style={styles.input}
          value={meal.time}
          onChangeText={(text) => setMeal(prev => ({ ...prev, time: text }))}
          placeholder="00:00"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Количество (г)</Text>
        <TextInput
          style={styles.input}
          value={meal.amount ? String(meal.amount) : ''}
          onChangeText={(text) => setMeal(prev => ({ ...prev, amount: Number(text) }))}
          keyboardType="numeric"
          placeholder="0"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Калории</Text>
        <TextInput
          style={styles.input}
          value={meal.calories ? String(meal.calories) : ''}
          onChangeText={(text) => setMeal(prev => ({ ...prev, calories: Number(text) }))}
          keyboardType="numeric"
          placeholder="0"
        />
      </View>

      <Card variant="subtle" style={styles.caloriesInfo}>
        <Text style={styles.caloriesLabel}>Рекомендуемое количество калорий в день</Text>
        <Text style={styles.caloriesValue}>{dailyCalories} ккал</Text>
      </Card>
    </ModalScreen>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  actionButton: {
    minWidth: 120,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    padding: spacing.sm,
    ...typography.body1,
    color: colors.text.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  caloriesInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  caloriesLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  caloriesValue: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
}); 