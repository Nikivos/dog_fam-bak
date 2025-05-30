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
import { FeedingSettingsStorage, FeedingSettings, FoodType } from '../data/feedingStorage';
import { calculateDailyCalories } from '../utils/calorieCalculator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { colors, typography, spacing, borderRadius } from '../theme/theme';
import { Card } from './Card';
import { ModalScreen } from './ModalScreen';

interface FeedingSettingsScreenProps {
  petId: string;
  petWeight: number;
  onClose: () => void;
}

export const FeedingSettingsScreen: React.FC<FeedingSettingsScreenProps> = ({
  petId,
  petWeight,
  onClose,
}) => {
  const [settings, setSettings] = useState<FeedingSettings>({
    id: '',
    activityLevel: 'medium',
    healthCondition: 'healthy',
    lifeStage: 'adult',
    petId,
    preferredFood: [],
  });

  const [newFood, setNewFood] = useState<Partial<FoodType>>({
    name: '',
    caloriesPerGram: 0,
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
    try {
      const storage = FeedingSettingsStorage.getInstance(petId);
      const savedSettings = await storage.getOrCreateSettings(petId);
      if (savedSettings) {
        setSettings(savedSettings);
      }

      // Загружаем типы корма
      const foodTypeStorage = FeedingSettingsStorage.getFoodTypeStorage();
      const foodTypes = await foodTypeStorage.getFoodTypes();
      setSettings(prev => ({
        ...prev,
        preferredFood: foodTypes,
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить настройки кормления');
    }
  };

  const handleSave = async () => {
    try {
      const storage = FeedingSettingsStorage.getInstance(petId);
      await storage.save(settings);
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить настройки кормления');
    }
  };

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.caloriesPerGram) {
      Alert.alert('Ошибка', 'Заполните название и калорийность корма');
      return;
    }

    if (isNaN(Number(newFood.caloriesPerGram)) || Number(newFood.caloriesPerGram) <= 0) {
      Alert.alert('Ошибка', 'Укажите корректное количество калорий');
      return;
    }

    try {
      const foodTypeStorage = FeedingSettingsStorage.getFoodTypeStorage();
      const foodType = await foodTypeStorage.saveFoodType({
        name: newFood.name,
        caloriesPerGram: Number(newFood.caloriesPerGram),
        description: newFood.description || undefined,
      });

      // Обновляем локальное состояние
      const foodTypes = await foodTypeStorage.getFoodTypes();
      setSettings(prev => ({
        ...prev,
        preferredFood: foodTypes,
      }));

      setNewFood({ name: '', caloriesPerGram: 0, description: '' });
    } catch (error) {
      console.error('Error adding food type:', error);
      Alert.alert('Ошибка', 'Не удалось добавить тип корма');
    }
  };

  const handleRemoveFood = async (foodId: string) => {
    try {
      const foodTypeStorage = FeedingSettingsStorage.getFoodTypeStorage();
      await foodTypeStorage.deleteFoodType(foodId);

      // Обновляем локальное состояние
      const foodTypes = await foodTypeStorage.getFoodTypes();
      setSettings(prev => ({
        ...prev,
        preferredFood: foodTypes,
      }));
    } catch (error) {
      console.error('Error removing food type:', error);
      Alert.alert('Ошибка', 'Не удалось удалить тип корма');
    }
  };

  const dailyCalories = calculateDailyCalories({
    weightKg: petWeight,
    activityLevel: settings.activityLevel,
    healthCondition: settings.healthCondition,
    lifeStage: settings.lifeStage,
  });

  const renderOption = (
    title: string,
    options: { value: string; label: string }[],
    value: string,
    onChange: (value: any) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <Button
            key={option.value}
            variant={value === option.value ? 'primary' : 'tertiary'}
            size="small"
            onPress={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionButtons}>
      <Button variant="tertiary" size="medium" onPress={onClose} style={styles.actionButton}>
        Отмена
      </Button>
      <Button variant="primary" size="medium" onPress={handleSave} style={styles.actionButton}>
        Сохранить
      </Button>
    </View>
  );

  return (
    <ModalScreen
      title="Настройки питания"
      onClose={onClose}
      actions={renderActions()}
    >
      {renderOption(
        'Уровень активности',
        [
          { value: 'low', label: 'Низкий' },
          { value: 'medium', label: 'Средний' },
          { value: 'high', label: 'Высокий' },
        ],
        settings.activityLevel,
        (value) => setSettings(prev => ({ ...prev, activityLevel: value }))
      )}

      {renderOption(
        'Состояние здоровья',
        [
          { value: 'healthy', label: 'Здоровый' },
          { value: 'overweight', label: 'Избыточный вес' },
          { value: 'underweight', label: 'Недостаточный вес' },
        ],
        settings.healthCondition,
        (value) => setSettings(prev => ({ ...prev, healthCondition: value }))
      )}

      {renderOption(
        'Возрастная группа',
        [
          { value: 'puppy', label: 'Щенок' },
          { value: 'adult', label: 'Взрослый' },
          { value: 'senior', label: 'Пожилой' },
        ],
        settings.lifeStage,
        (value) => setSettings(prev => ({ ...prev, lifeStage: value }))
      )}

      <View style={styles.caloriesInfo}>
        <Text style={styles.label}>Рекомендуемое количество калорий</Text>
        <Text style={styles.caloriesValue}>{dailyCalories} ккал/день</Text>
      </View>

      <View style={styles.foodSection}>
        <Text style={styles.sectionTitle}>Корм</Text>
        
        <View style={styles.foodForm}>
          <TextInput
            style={styles.input}
            placeholder="Название корма"
            value={newFood.name}
            onChangeText={(text) => {
              setNewFood(prev => ({ ...prev, name: text }));
              setShowSuggestions(text.length > 0);
            }}
            onFocus={() => setShowSuggestions((newFood.name || '').length > 0)}
          />
          
          {showSuggestions && (
            <View style={styles.suggestions}>
              {filteredFoods.map((food, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setNewFood({
                      name: food.name,
                      caloriesPerGram: food.calories,
                      description: food.description,
                    });
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionTitle}>{food.name}</Text>
                  <Text style={styles.suggestionCalories}>{food.calories} ккал/100г</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Калорий на 100г"
            value={newFood.caloriesPerGram ? String(newFood.caloriesPerGram) : ''}
            onChangeText={(text) => setNewFood(prev => ({ ...prev, caloriesPerGram: Number(text) }))}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Описание (необязательно)"
            value={newFood.description}
            onChangeText={(text) => setNewFood(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={3}
          />

          <Button
            variant="primary"
            size="medium"
            onPress={handleAddFood}
            style={styles.addButton}
          >
            Добавить корм
          </Button>
        </View>

        <View style={styles.foodList}>
          {settings.preferredFood?.map((food) => (
            <Card key={food.id} variant="elevated" style={styles.foodCard}>
              <View style={styles.foodContent}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodCalories}>{food.caloriesPerGram} ккал/100г</Text>
                  {food.description && (
                    <Text style={styles.foodDescription}>{food.description}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveFood(food.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ModalScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    position: 'absolute',
    right: spacing.md,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  actionButton: {
    minWidth: 120,
  },
  caloriesInfo: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.medium,
  },
  caloriesValue: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  foodSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  foodForm: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    padding: spacing.sm,
    ...typography.body1,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    marginTop: spacing.sm,
  },
  suggestions: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionTitle: {
    ...typography.body1,
    color: colors.text.primary,
  },
  suggestionCalories: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  foodList: {
    gap: spacing.sm,
  },
  foodCard: {
    marginBottom: spacing.xs,
  },
  foodContent: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  foodCalories: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  foodDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: spacing.xs,
  },
}); 