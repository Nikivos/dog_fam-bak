import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedingStorage, FeedingSettings, FoodType } from '../data/feedingStorage';
import { calculateDailyCalories } from '../utils/calorieCalculator';

type Props = {
  petId: string;
  petWeight: number;
  onClose: () => void;
};

export const FeedingSettingsScreen = ({ petId, petWeight, onClose }: Props) => {
  const [settings, setSettings] = useState<FeedingSettings>({
    petId,
    activityLevel: 'normal',
    healthCondition: 'healthy',
    lifeStage: 'adult',
    preferredFood: [],
  });

  const [newFood, setNewFood] = useState<Partial<FoodType>>({
    name: '',
    caloriesPer100g: 0,
    description: '',
  });

  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Список популярных кормов для автозаполнения
  const popularFoods = [
    { name: 'Fitmin Dog Purity Rice Puppy Lamb & Salmon', calories: 371, description: 'Сухой корм для щенков с ягненком и лососем' },
    { name: 'Fitmin Medium Maintenance', calories: 371, description: 'Сухой корм для взрослых собак средних пород' },
    { name: 'Fitmin Dog Mini Maintenance', calories: 363, description: 'Сухой корм для взрослых собак мелких пород' },
    { name: 'Fitmin Dog Medium/Maxi Puppy Lamb With Beef', calories: 380, description: 'Сухой корм для щенков средних и крупных пород с ягненком и говядиной' },
    { name: 'Royal Canin Medium Adult', calories: 363, description: 'Сухой корм для взрослых собак средних пород' },
    { name: 'Hill\'s Science Plan Adult', calories: 348, description: 'Сухой корм с курицей для взрослых собак' },
    { name: 'Pedigree Adult', calories: 340, description: 'Сухой корм для взрослых собак' },
    { name: 'Pro Plan Adult', calories: 355, description: 'Сухой корм для взрослых собак' },
    { name: 'Acana Adult', calories: 380, description: 'Сухой корм для взрослых собак' },
    { name: 'Orijen Adult', calories: 390, description: 'Сухой корм для взрослых собак' },
  ];

  const filteredFoods = popularFoods.filter(food => 
    food.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Загружаем настройки
    const savedSettings = await FeedingStorage.getFeedingSettings(petId);
    if (savedSettings) {
      setSettings(savedSettings);
    }

    // Загружаем типы корма
    const foodTypes = await FeedingStorage.getFoodTypes();
    setSettings(prev => ({
      ...prev,
      preferredFood: foodTypes,
    }));
  };

  const handleSave = async () => {
    await FeedingStorage.saveFeedingSettings(settings);
    onClose();
  };

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.caloriesPer100g) {
      Alert.alert('Ошибка', 'Заполните название и калорийность корма');
      return;
    }

    if (isNaN(Number(newFood.caloriesPer100g)) || Number(newFood.caloriesPer100g) <= 0) {
      Alert.alert('Ошибка', 'Укажите корректное количество калорий');
      return;
    }

    const foodType: FoodType = {
      id: FeedingStorage.generateId(),
      name: newFood.name,
      caloriesPer100g: Number(newFood.caloriesPer100g),
      description: newFood.description,
    };

    // Сохраняем тип корма
    await FeedingStorage.saveFoodType(foodType);

    // Обновляем локальное состояние
    const updatedFoodTypes = await FeedingStorage.getFoodTypes();
    setSettings(prev => ({
      ...prev,
      preferredFood: updatedFoodTypes,
    }));

    setNewFood({ name: '', caloriesPer100g: 0, description: '' });
  };

  const handleRemoveFood = async (foodId: string) => {
    // Удаляем тип корма
    await FeedingStorage.deleteFoodType(foodId);

    // Обновляем локальное состояние
    const updatedFoodTypes = await FeedingStorage.getFoodTypes();
    setSettings(prev => ({
      ...prev,
      preferredFood: updatedFoodTypes,
    }));
  };

  const dailyCalories = calculateDailyCalories({
    weightKg: petWeight,
    activityLevel: settings.activityLevel,
    healthCondition: settings.healthCondition,
    lifeStage: settings.lifeStage,
  });

  const activityOptions = [
    { value: 'low', label: 'Низкая активность' },
    { value: 'normal', label: 'Обычная активность' },
    { value: 'high', label: 'Высокая активность' },
  ] as const;

  const healthOptions = [
    { value: 'healthy', label: 'Здоров' },
    { value: 'overweight', label: 'Избыточный вес' },
    { value: 'underweight', label: 'Недостаточный вес' },
    { value: 'pregnant', label: 'Беременность' },
    { value: 'nursing', label: 'Кормление' },
  ] as const;

  const lifeStageOptions = [
    { value: 'puppy', label: 'Щенок' },
    { value: 'adult', label: 'Взрослый' },
    { value: 'senior', label: 'Пожилой' },
  ] as const;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Настройки питания</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Калории */}
      <View style={[styles.card, styles.elevation]}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientCard}
        >
          <Text style={styles.cardTitle}>Рекомендуемая норма калорий</Text>
          <Text style={styles.caloriesValue}>{dailyCalories}</Text>
          <Text style={styles.caloriesLabel}>ккал в день</Text>
        </LinearGradient>
      </View>

      {/* Активность */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уровень активности</Text>
        <View style={styles.optionsContainer}>
          {activityOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.activityLevel === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setSettings(prev => ({ ...prev, activityLevel: option.value }))}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.activityLevel === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Состояние здоровья */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Состояние здоровья</Text>
        <View style={styles.optionsContainer}>
          {healthOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.healthCondition === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setSettings(prev => ({ ...prev, healthCondition: option.value }))}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.healthCondition === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Стадия жизни */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Стадия жизни</Text>
        <View style={styles.optionsContainer}>
          {lifeStageOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.lifeStage === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setSettings(prev => ({ ...prev, lifeStage: option.value }))}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.lifeStage === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Корм */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Корм</Text>
        {settings.preferredFood.map(food => (
          <View key={food.id} style={styles.foodItem}>
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodCalories}>{food.caloriesPer100g} ккал/100г</Text>
              {food.description && (
                <Text style={styles.foodDescription}>{food.description}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFood(food.id)}
            >
              <Ionicons name="trash" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addFoodForm}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Название корма"
              value={newFood.name}
              onChangeText={(text) => {
                setNewFood(prev => ({ ...prev, name: text }));
                setSearchText(text);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (newFood.name) {
                  setSearchText(newFood.name);
                  setShowSuggestions(true);
                }
              }}
            />
            {showSuggestions && searchText && (
              <View style={[styles.suggestionsContainer, styles.elevation]}>
                {filteredFoods.map((food, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setNewFood({
                        name: food.name,
                        caloriesPer100g: food.calories,
                        description: food.description,
                      });
                      setSearchText('');
                      setShowSuggestions(false);
                    }}
                  >
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionName}>{food.name}</Text>
                      <Text style={styles.suggestionCalories}>
                        {food.calories} ккал/100г
                      </Text>
                      <Text style={styles.suggestionDescription} numberOfLines={1}>
                        {food.description}
                      </Text>
                    </View>
                    <Ionicons name="add-circle-outline" size={24} color="#4facfe" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Калорий на 100г"
            value={newFood.caloriesPer100g?.toString()}
            onChangeText={text =>
              setNewFood(prev => ({ ...prev, caloriesPer100g: Number(text) }))
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Описание (необязательно)"
            value={newFood.description}
            onChangeText={text => setNewFood(prev => ({ ...prev, description: text }))}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>Добавить корм</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Кнопка сохранения */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveGradient}
        >
          <Text style={styles.saveText}>Сохранить настройки</Text>
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
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientCard: {
    padding: 24,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  optionButtonActive: {
    backgroundColor: '#4facfe',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  foodCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  addFoodForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4facfe',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    maxHeight: 200,
    zIndex: 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
}); 