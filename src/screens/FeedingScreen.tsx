import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MealForm } from '../components/MealForm';
import { FeedingSettingsScreen } from '../components/FeedingSettings';
import { FeedingStorage, Meal } from '../data/feedingStorage';
import { calculateDailyCalories } from '../utils/calorieCalculator';

const { width } = Dimensions.get('window');

type Props = {
  petId: string;
  petWeight: number;
};

const MEAL_ICONS: Record<Meal['type'], keyof typeof Ionicons.glyphMap> = {
  breakfast: 'sunny',
  lunch: 'partly-sunny',
  dinner: 'moon',
};

const MEAL_COLORS: Record<Meal['type'], [string, string]> = {
  breakfast: ['#FF9500', '#FF5E3A'],
  lunch: ['#4facfe', '#00f2fe'],
  dinner: ['#667eea', '#764ba2'],
};

export const FeedingScreen = ({ petId, petWeight }: Props) => {
  const [schedule, setSchedule] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealForm, setShowMealForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>();
  const [dailyCalories, setDailyCalories] = useState(0);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    // Загрузка настроек питания
    const settings = await FeedingStorage.getFeedingSettings(petId);
    if (settings) {
      const calories = calculateDailyCalories({
        weightKg: petWeight,
        activityLevel: settings.activityLevel,
        healthCondition: settings.healthCondition,
        lifeStage: settings.lifeStage,
      });
      setDailyCalories(calories);
    }

    // Загрузка расписания на выбранную дату
    const dateString = selectedDate.toISOString().split('T')[0];
    const meals = await FeedingStorage.getMeals(petId, dateString);
    setSchedule(meals);
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
    await FeedingStorage.saveMeal(meal);
    await loadData();
    setShowMealForm(false);
  };

  const toggleMealComplete = async (meal: Meal) => {
    const updatedMeal = { ...meal, completed: !meal.completed };
    await FeedingStorage.saveMeal(updatedMeal);
    await loadData();
  };

  const totalCalories = schedule.reduce((sum, meal) => sum + meal.calories, 0);
  const consumedCalories = schedule
    .filter(meal => meal.completed)
    .reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Питание</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Ionicons name="settings" size={24} color="#4facfe" />
          </TouchableOpacity>
        </View>

        {/* Статистика */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, styles.elevation]}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.statsContent}>
                <Text style={styles.statsTitle}>Калории</Text>
                <Text style={styles.statsValue}>{consumedCalories}/{totalCalories}</Text>
                <Text style={styles.statsSubtitle}>ккал</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={[styles.statsCard, styles.elevation]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.statsContent}>
                <Text style={styles.statsTitle}>Порции</Text>
                <Text style={styles.statsValue}>
                  {schedule.filter(m => m.completed).length}/{schedule.length}
                </Text>
                <Text style={styles.statsSubtitle}>на сегодня</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Расписание */}
        <View style={[styles.card, styles.elevation]}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={24} color="#4facfe" />
            <Text style={styles.cardTitle}>Расписание кормления</Text>
          </View>
          <View style={styles.mealList}>
            {schedule.map(meal => (
              <TouchableOpacity
                key={meal.id}
                style={[styles.mealItem, meal.completed && styles.mealItemCompleted]}
                onPress={() => toggleMealComplete(meal)}
                onLongPress={() => handleEditMeal(meal)}
              >
                <LinearGradient
                  colors={MEAL_COLORS[meal.type]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mealGradient}
                >
                  <View style={styles.mealIcon}>
                    <Ionicons name={MEAL_ICONS[meal.type]} size={24} color="#fff" />
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                    <Text style={styles.mealType}>
                      {meal.amount}г • {meal.calories} ккал
                    </Text>
                  </View>
                  <View style={styles.mealCheck}>
                    <Ionicons
                      name={meal.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={24}
                      color="#fff"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Кнопка добавления */}
        <TouchableOpacity style={[styles.addButton, styles.elevation]} onPress={handleAddMeal}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Добавить прием пищи</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Модальное окно с формой приема пищи */}
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

      {/* Модальное окно с настройками */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientCard: {
    padding: 16,
    height: 120,
  },
  statsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statsTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  mealList: {
    gap: 12,
  },
  mealItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mealItemCompleted: {
    opacity: 0.8,
  },
  mealGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  mealType: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  mealCheck: {
    marginLeft: 12,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 