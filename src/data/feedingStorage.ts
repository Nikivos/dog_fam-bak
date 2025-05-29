import AsyncStorage from '@react-native-async-storage/async-storage';

export type Meal = {
  id: string;
  petId: string;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  amount: number;
  calories: number;
  completed: boolean;
  date: string; // ISO date string
};

export type FoodType = {
  id: string;
  name: string;
  caloriesPer100g: number;
  description?: string;
};

export type FeedingSettings = {
  petId: string;
  activityLevel: 'low' | 'normal' | 'high';
  healthCondition: 'healthy' | 'overweight' | 'underweight' | 'pregnant' | 'nursing';
  lifeStage: 'puppy' | 'adult' | 'senior';
  preferredFood: FoodType[];
};

const STORAGE_KEYS = {
  MEALS: '@dogfam/meals',
  FOOD_TYPES: '@dogfam/food_types',
  FEEDING_SETTINGS: '@dogfam/feeding_settings',
} as const;

const DEFAULT_FOOD_TYPES: FoodType[] = [
  {
    id: 'default-dry-1',
    name: 'Royal Canin Medium Adult',
    caloriesPer100g: 363,
    description: 'Сухой корм для взрослых собак средних пород',
  },
  {
    id: 'default-dry-2',
    name: 'Hill\'s Science Plan Adult',
    caloriesPer100g: 348,
    description: 'Сухой корм с курицей для взрослых собак',
  },
  {
    id: 'default-wet-1',
    name: 'Pedigree паштет',
    caloriesPer100g: 85,
    description: 'Влажный корм с говядиной',
  },
];

export class FeedingStorage {
  // Meals
  static async getMeals(petId: string, date: string): Promise<Meal[]> {
    try {
      const storedMeals = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
      if (!storedMeals) return [];

      const meals: Meal[] = JSON.parse(storedMeals);
      return meals.filter(meal => meal.petId === petId && meal.date === date);
    } catch (error) {
      console.error('Error getting meals:', error);
      return [];
    }
  }

  static async saveMeal(meal: Meal): Promise<void> {
    try {
      const storedMeals = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
      const meals: Meal[] = storedMeals ? JSON.parse(storedMeals) : [];
      
      const existingIndex = meals.findIndex(m => m.id === meal.id);
      if (existingIndex !== -1) {
        meals[existingIndex] = meal;
      } else {
        meals.push(meal);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  }

  static async deleteMeal(mealId: string): Promise<void> {
    try {
      const storedMeals = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
      if (!storedMeals) return;

      const meals: Meal[] = JSON.parse(storedMeals);
      const filteredMeals = meals.filter(meal => meal.id !== mealId);
      
      await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(filteredMeals));
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  }

  // Food Types
  static async getFoodTypes(): Promise<FoodType[]> {
    try {
      const storedFoodTypes = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_TYPES);
      if (!storedFoodTypes) {
        // Если типы корма еще не сохранены, инициализируем значениями по умолчанию
        await this.initializeDefaultFoodTypes();
        return DEFAULT_FOOD_TYPES;
      }

      return JSON.parse(storedFoodTypes);
    } catch (error) {
      console.error('Error getting food types:', error);
      return DEFAULT_FOOD_TYPES; // В случае ошибки возвращаем значения по умолчанию
    }
  }

  static async saveFoodType(foodType: FoodType): Promise<void> {
    try {
      const foodTypes = await this.getFoodTypes();
      const existingIndex = foodTypes.findIndex(f => f.id === foodType.id);
      
      if (existingIndex !== -1) {
        foodTypes[existingIndex] = foodType;
      } else {
        foodTypes.push(foodType);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_TYPES, JSON.stringify(foodTypes));
    } catch (error) {
      console.error('Error saving food type:', error);
    }
  }

  static async deleteFoodType(foodTypeId: string): Promise<void> {
    try {
      const foodTypes = await this.getFoodTypes();
      const updatedFoodTypes = foodTypes.filter(f => f.id !== foodTypeId);
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_TYPES, JSON.stringify(updatedFoodTypes));
    } catch (error) {
      console.error('Error deleting food type:', error);
    }
  }

  // Feeding Settings
  static async getFeedingSettings(petId: string): Promise<FeedingSettings | null> {
    try {
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.FEEDING_SETTINGS);
      if (!storedSettings) return null;

      const settings: FeedingSettings[] = JSON.parse(storedSettings);
      return settings.find(s => s.petId === petId) || null;
    } catch (error) {
      console.error('Error getting feeding settings:', error);
      return null;
    }
  }

  static async saveFeedingSettings(settings: FeedingSettings): Promise<void> {
    try {
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEYS.FEEDING_SETTINGS);
      const allSettings: FeedingSettings[] = storedSettings ? JSON.parse(storedSettings) : [];
      
      const existingIndex = allSettings.findIndex(s => s.petId === settings.petId);
      if (existingIndex !== -1) {
        allSettings[existingIndex] = settings;
      } else {
        allSettings.push(settings);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.FEEDING_SETTINGS, JSON.stringify(allSettings));
    } catch (error) {
      console.error('Error saving feeding settings:', error);
    }
  }

  // Initialization
  private static async initializeDefaultFoodTypes(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_TYPES, JSON.stringify(DEFAULT_FOOD_TYPES));
    } catch (error) {
      console.error('Error initializing default food types:', error);
    }
  }

  // Helpers
  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 