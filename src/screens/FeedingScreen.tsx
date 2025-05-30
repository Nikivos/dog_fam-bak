import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MealForm } from '../components/MealForm';
import { FeedingSettingsScreen } from '../components/FeedingSettings';
import { MealStorage, Meal, FeedingSettingsStorage } from '../data/feedingStorage';
import { calculateDailyCalories } from '../utils/calorieCalculator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { RouteProp } from '@react-navigation/native';
import { TabParamList } from '../types/navigation';

type FeedingScreenRouteProp = RouteProp<TabParamList, 'Питание'>;

type Props = {
  route: FeedingScreenRouteProp;
};

const MEAL_ICONS: Record<Meal['type'], keyof typeof Ionicons.glyphMap> = {
  breakfast: 'sunny',
  lunch: 'partly-sunny',
  dinner: 'moon',
};

export const FeedingScreen: React.FC<Props> = ({ route }) => {
  const { petId, petWeight } = route.params;
  const [schedule, setSchedule] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealForm, setShowMealForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>();
  const [dailyCalories, setDailyCalories] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const feedingSettingsStorage = FeedingSettingsStorage.getInstance(petId);
      const settings = await feedingSettingsStorage.getOrCreateSettings(petId);
      
      if (settings) {
        const calories = calculateDailyCalories({
          weightKg: petWeight,
          activityLevel: settings.activityLevel,
          healthCondition: settings.healthCondition,
          lifeStage: settings.lifeStage,
        });
        setDailyCalories(calories);
      }

      const dateString = selectedDate.toISOString().split('T')[0];
      const mealStorage = MealStorage.getInstance(petId, dateString);
      const meals = await mealStorage.getMealsForDate(dateString);
      setSchedule(meals);
    } catch (error) {
      console.error('Error loading feeding data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные о кормлении');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowMealForm(true);
  };

  const handleAddMeal = () => {
    setSelectedMeal(undefined);
    setShowMealForm(true);
  };

  const handleSubmitMeal = async (meal: Meal) => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const mealStorage = MealStorage.getInstance(petId, dateString);
      await mealStorage.save(meal);
      await loadData();
      setShowMealForm(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить прием пищи');
    }
  };

  const toggleMealComplete = async (meal: Meal) => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const mealStorage = MealStorage.getInstance(petId, dateString);
      await mealStorage.updateMealCompletion(meal.id, !meal.completed);
      await loadData();
    } catch (error) {
      console.error('Error toggling meal completion:', error);
      Alert.alert('Ошибка', 'Не удалось обновить статус приема пищи');
    }
  };

  const totalCalories = schedule.reduce((sum, meal) => sum + meal.calories, 0);
  const consumedCalories = schedule
    .filter(meal => meal.completed)
    .reduce((sum, meal) => sum + meal.calories, 0);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const renderMeal = (meal: Meal) => (
    <Card
      key={meal.id}
      variant={meal.completed ? 'subtle' : 'elevated'}
      style={styles.mealCard}
      onPress={() => handleEditMeal(meal)}
    >
      <View style={styles.mealContent}>
        <View style={[
          styles.mealIcon,
          { backgroundColor: meal.completed ? colors.success : colors.primary }
        ]}>
          <Ionicons name={MEAL_ICONS[meal.type]} size={24} color={colors.text.light} />
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealTime}>{meal.time}</Text>
          <Text style={styles.mealType}>
            {meal.amount}г • {meal.calories} ккал
          </Text>
        </View>
        <Button
          variant="tertiary"
          size="small"
          onPress={() => toggleMealComplete(meal)}
          icon={
            <Ionicons
              name={meal.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={24}
              color={meal.completed ? colors.success : colors.primary}
            />
          }
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Питание</Text>
            <Text style={styles.subtitle}>Расписание кормления</Text>
          </View>
          <Button
            variant="tertiary"
            size="small"
            onPress={() => setShowSettings(true)}
            icon={<Ionicons name="settings" size={24} color={colors.primary} />}
          />
        </View>

        <View style={styles.dateContainer}>
          <Button
            variant="tertiary"
            size="medium"
            onPress={() => setShowDatePicker(true)}
            icon={<Ionicons name="calendar" size={20} color={colors.primary} />}
          >
            {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
          </Button>
        </View>

        <View style={styles.statsContainer}>
          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsContent}>
              <Ionicons name="flame" size={24} color={colors.primary} />
              <Text style={styles.statsValue}>{consumedCalories}/{totalCalories}</Text>
              <Text style={styles.statsLabel}>калорий</Text>
            </View>
          </Card>
          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsContent}>
              <Ionicons name="restaurant" size={24} color={colors.primary} />
              <Text style={styles.statsValue}>
                {schedule.filter(m => m.completed).length}/{schedule.length}
              </Text>
              <Text style={styles.statsLabel}>порций</Text>
            </View>
          </Card>
        </View>

        <View style={styles.scheduleContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="time" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Расписание</Text>
            </View>
            <Button
              variant="tertiary"
              size="small"
              onPress={handleAddMeal}
              icon={<Ionicons name="add" size={20} color={colors.primary} />}
            >
              Добавить
            </Button>
          </View>

          <View style={styles.mealList}>
            {schedule.map(renderMeal)}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showMealForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <MealForm
          petId={petId}
          dailyCalories={dailyCalories}
          onSubmit={handleSubmitMeal}
          onClose={() => setShowMealForm(false)}
          initialValues={selectedMeal}
        />
      </Modal>

      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <FeedingSettingsScreen
          petId={petId}
          petWeight={petWeight}
          onClose={() => {
            setShowSettings(false);
            loadData();
          }}
        />
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  dateContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
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
  scheduleContainer: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  mealList: {
    gap: spacing.sm,
  },
  mealCard: {
    marginBottom: spacing.xs,
  },
  mealContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  mealInfo: {
    flex: 1,
  },
  mealTime: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  mealType: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
}); 