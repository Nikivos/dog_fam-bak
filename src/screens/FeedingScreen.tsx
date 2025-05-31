import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Alert, TextStyle, ViewStyle } from 'react-native';
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
import { colors, spacing, shadows, borderRadius, typography, layout } from '../theme/theme';
import { RouteProp } from '@react-navigation/native';
import { TabParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type FeedingScreenRouteProp = RouteProp<TabParamList, 'Питание'>;

type Props = {
  route: FeedingScreenRouteProp;
};

const MEAL_ICONS = {
  breakfast: 'sunny-outline',
  lunch: 'partly-sunny-outline',
  dinner: 'moon-outline',
} as const;

export const FeedingScreen: React.FC<Props> = ({ route }) => {
  const { petId, petWeight } = route.params;
  const [schedule, setSchedule] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>(undefined);
  const [dailyCalories, setDailyCalories] = useState(0);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    const storage = MealStorage.getInstance();
    const settingsStorage = FeedingSettingsStorage.getInstance();
    
    await Promise.all([storage.load(), settingsStorage.load()]);
    
    const settings = settingsStorage.getSettings();
    const calories = calculateDailyCalories({
      weightKg: petWeight,
      activityLevel: settings.activityLevel,
      healthCondition: settings.healthCondition,
      lifeStage: settings.lifeStage,
    });
    
    setDailyCalories(calories);
    setSchedule(storage.getMealsForDate(selectedDate));
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddMeal = () => {
    setSelectedMeal(undefined);
    setShowMealForm(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowMealForm(true);
  };

  const handleSubmitMeal = async (meal: Meal) => {
    const storage = MealStorage.getInstance();
    await storage.saveMeal(meal);
    setShowMealForm(false);
    loadData();
  };

  const toggleMealComplete = async (meal: Meal) => {
    const storage = MealStorage.getInstance();
    await storage.updateMeal({
      ...meal,
      completed: !meal.completed,
    });
    loadData();
  };

  const consumedCalories = schedule
    .filter(m => m.completed)
    .reduce((sum, meal) => sum + meal.calories, 0);

  const totalCalories = dailyCalories;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, `${colors.primary}80`]}
          style={styles.header}
        >
          <View>
            <Text style={styles.title}>Питание</Text>
            <Text style={styles.subtitle}>Расписание кормления</Text>
          </View>
          <Button
            variant="tertiary"
            size="small"
            onPress={() => setShowSettings(true)}
            icon={<Ionicons name="settings-outline" size={24} color={colors.text.light} />}
          />
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.dateContainer}>
            <Button
              variant="tertiary"
              size="medium"
              onPress={() => setShowDatePicker(true)}
              icon={<Ionicons name="calendar-outline" size={20} color={colors.primary} />}
            >
              {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
            </Button>
          </View>

          <View style={styles.statsContainer}>
            <Card variant="elevated" style={styles.statsCard}>
              <LinearGradient
                colors={[`${colors.primary}05`, `${colors.primary}10`]}
                style={styles.statsContent}
              >
                <View style={[styles.statsIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons name="flame-outline" size={24} color={colors.primary} />
                </View>
                <Text style={styles.statsValue}>{consumedCalories}/{totalCalories}</Text>
                <Text style={styles.statsLabel}>калорий</Text>
              </LinearGradient>
            </Card>
            <Card variant="elevated" style={styles.statsCard}>
              <LinearGradient
                colors={[`${colors.secondary}05`, `${colors.secondary}10`]}
                style={styles.statsContent}
              >
                <View style={[styles.statsIcon, { backgroundColor: `${colors.secondary}15` }]}>
                  <Ionicons name="restaurant-outline" size={24} color={colors.secondary} />
                </View>
                <Text style={styles.statsValue}>
                  {schedule.filter(m => m.completed).length}/{schedule.length}
                </Text>
                <Text style={styles.statsLabel}>порций</Text>
              </LinearGradient>
            </Card>
          </View>

          <View style={styles.scheduleContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={[`${colors.primary}15`, `${colors.primary}05`]}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                </LinearGradient>
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
              {schedule.map(meal => (
                <Card
                  key={meal.id}
                  variant={meal.completed ? 'subtle' : 'elevated'}
                  style={styles.mealCard}
                  onPress={() => handleEditMeal(meal)}
                >
                  <LinearGradient
                    colors={[
                      meal.completed ? `${colors.success}05` : `${colors.primary}05`,
                      meal.completed ? `${colors.success}10` : `${colors.primary}10`
                    ]}
                    style={styles.mealContent}
                  >
                    <View style={[
                      styles.mealIcon,
                      { backgroundColor: meal.completed ? `${colors.success}15` : `${colors.primary}15` }
                    ]}>
                      <Ionicons 
                        name={MEAL_ICONS[meal.type]} 
                        size={24} 
                        color={meal.completed ? colors.success : colors.primary} 
                      />
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
                  </LinearGradient>
                </Card>
              ))}
            </View>
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
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dateContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  } as ViewStyle,
  statsCard: {
    flex: 1,
    margin: spacing.xs,
    overflow: 'hidden',
  } as ViewStyle,
  statsContent: {
    alignItems: 'center',
    padding: spacing.md,
  } as ViewStyle,
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  } as ViewStyle,
  statsValue: {
    ...typography.h2,
  } as TextStyle,
  statsLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  } as TextStyle,
  scheduleContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  mealList: {
    marginTop: spacing.sm,
  } as ViewStyle,
  mealCard: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  mealContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  } as ViewStyle,
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  mealInfo: {
    flex: 1,
    marginLeft: spacing.md,
  } as ViewStyle,
  mealTime: {
    ...typography.body,
    fontWeight: '500',
  } as TextStyle,
  mealType: {
    ...typography.caption,
    color: colors.text.secondary,
  } as TextStyle,
}); 