import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedingStorage, FoodType } from '../data/feedingStorage';
import { calculatePortionSize } from '../utils/calorieCalculator';

type MealFormProps = {
  petId: string;
  dailyCalories: number;
  onSubmit: (meal: {
    id: string;
    petId: string;
    time: string;
    type: 'breakfast' | 'lunch' | 'dinner';
    amount: number;
    calories: number;
    completed: boolean;
    date: string;
  }) => void;
  onClose: () => void;
  initialValues?: {
    id: string;
    time: string;
    type: 'breakfast' | 'lunch' | 'dinner';
    amount: number;
    calories: number;
  };
};

export const MealForm = ({ petId, dailyCalories, onSubmit, onClose, initialValues }: MealFormProps) => {
  const [time, setTime] = useState(
    initialValues?.time ? new Date(`2000-01-01T${initialValues.time}`) : new Date()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [type, setType] = useState<'breakfast' | 'lunch' | 'dinner'>(
    initialValues?.type || 'breakfast'
  );
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [showFoodSelector, setShowFoodSelector] = useState(false);

  // Добавляем автофокус и обработку нажатия Enter
  const searchInputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    loadFoodTypes();
    // Автофокус на поле поиска при открытии формы
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const loadFoodTypes = async () => {
    const types = await FeedingStorage.getFoodTypes();
    setFoodTypes(types);
  };

  const calculateCalories = (amount: string, food: FoodType | null): number => {
    if (!food || !amount) return 0;
    return Math.round((Number(amount) * food.caloriesPer100g) / 100);
  };

  const handleSubmit = () => {
    if (!amount || !selectedFood) {
      Alert.alert('Ошибка', 'Выберите корм и укажите количество');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Ошибка', 'Укажите корректное количество корма');
      return;
    }

    const calories = calculateCalories(amount, selectedFood);
    const date = new Date().toISOString().split('T')[0];

    onSubmit({
      id: initialValues?.id || FeedingStorage.generateId(),
      petId,
      time: time.toLocaleTimeString().slice(0, 5),
      type,
      amount: Number(amount),
      calories,
      completed: false,
      date,
    });
  };

  const mealTypes = [
    { value: 'breakfast', label: 'Завтрак', icon: 'sunny' },
    { value: 'lunch', label: 'Обед', icon: 'partly-sunny' },
    { value: 'dinner', label: 'Ужин', icon: 'moon' },
  ] as const;

  const recommendedAmount = selectedFood
    ? calculatePortionSize(dailyCalories, selectedFood.caloriesPer100g, 3)
    : 0;

  // Если нет типов корма, показываем сообщение
  if (foodTypes.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Новый прием пищи</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Сначала добавьте типы корма в настройках питания
          </Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={onClose}>
            <Text style={styles.emptyStateButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialValues ? 'Редактировать прием пищи' : 'Новый прием пищи'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Тип приема пищи */}
      <View style={styles.section}>
        <Text style={styles.label}>Тип приема пищи</Text>
        <View style={styles.typeButtons}>
          {mealTypes.map(mealType => (
            <TouchableOpacity
              key={mealType.value}
              onPress={() => setType(mealType.value)}
              style={[styles.typeButton, type === mealType.value && styles.typeButtonActive]}
            >
              <Ionicons
                name={mealType.icon as any}
                size={24}
                color={type === mealType.value ? '#fff' : '#333'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === mealType.value && styles.typeButtonTextActive,
                ]}
              >
                {mealType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Время */}
      <View style={styles.section}>
        <Text style={styles.label}>Время</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time" size={24} color="#4facfe" />
          <Text style={styles.timeText}>
            {time.toLocaleTimeString().slice(0, 5)}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event: any, selectedTime?: Date) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedTime) {
                setTime(selectedTime);
              }
            }}
          />
        )}
      </View>

      {/* Корм */}
      <View style={styles.section}>
        <Text style={styles.label}>Корм</Text>
        <TouchableOpacity 
          style={styles.foodSelectorButton}
          onPress={() => setShowFoodSelector(true)}
        >
          {selectedFood ? (
            <View style={styles.selectedFoodInfo}>
              <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
              <Text style={styles.selectedFoodCalories}>
                {selectedFood.caloriesPer100g} ккал/100г
              </Text>
            </View>
          ) : (
            <Text style={styles.foodSelectorPlaceholder}>
              Выберите корм
            </Text>
          )}
          <Ionicons 
            name={showFoodSelector ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>

        {showFoodSelector && (
          <View style={[styles.foodList, styles.elevation]}>
            {foodTypes.map(food => (
              <TouchableOpacity
                key={food.id}
                style={styles.foodItem}
                onPress={() => {
                  setSelectedFood(food);
                  setShowFoodSelector(false);
                }}
              >
                <View style={styles.foodItemContent}>
                  <Text style={styles.foodItemName}>{food.name}</Text>
                  <Text style={styles.foodItemCalories}>
                    {food.caloriesPer100g} ккал/100г
                  </Text>
                  {food.description && (
                    <Text style={styles.foodItemDescription} numberOfLines={1}>
                      {food.description}
                    </Text>
                  )}
                </View>
                {selectedFood?.id === food.id && (
                  <Ionicons name="checkmark" size={24} color="#4facfe" />
                )}
              </TouchableOpacity>
            ))}
            {foodTypes.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Сначала добавьте корм в настройках питания
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Количество */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Количество (г)</Text>
          <Text style={styles.recommendation}>
            Рекомендуемая порция: {recommendedAmount}г
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Введите количество корма"
        />
      </View>

      {/* Калории */}
      <View style={styles.section}>
        <Text style={styles.label}>Калории</Text>
        <View style={styles.caloriesCard}>
          <Text style={styles.caloriesValue}>
            {calculateCalories(amount, selectedFood)}
          </Text>
          <Text style={styles.caloriesLabel}>ккал</Text>
        </View>
      </View>

      {/* Кнопка сохранения */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitGradient}
        >
          <Text style={styles.submitText}>Сохранить</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 14,
    color: '#666',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  typeButtonActive: {
    backgroundColor: '#4facfe',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    paddingRight: 40, // Место для кнопки очистки
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionItemHover: {
    backgroundColor: '#fff',
  },
  suggestionContent: {
    flex: 1,
    marginRight: 8,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  suggestionCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  selectedFoodContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectedFoodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedFoodCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedFoodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  input: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    color: '#333',
  },
  caloriesCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitGradient: {
    padding: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#4facfe',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noResults: {
    padding: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  foodSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedFoodInfo: {
    flex: 1,
  },
  foodSelectorPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  foodList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    maxHeight: 300,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodItemContent: {
    flex: 1,
    marginRight: 8,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  foodItemCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  foodItemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 