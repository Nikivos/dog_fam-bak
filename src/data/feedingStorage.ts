import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseStorage, BaseEntity } from './baseStorage';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Meal extends BaseEntity {
  type: MealType;
  time: string;
  amount: number;
  calories: number;
  completed: boolean;
  petId: string;
  date: string;
}

export interface FoodType {
  id: string;
  name: string;
  caloriesPerGram: number;
  description?: string;
}

export interface FeedingSettings extends BaseEntity {
  activityLevel: 'low' | 'medium' | 'high';
  healthCondition: 'healthy' | 'overweight' | 'underweight';
  lifeStage: 'puppy' | 'adult' | 'senior';
  petId: string;
  preferredFood?: FoodType[];
}

const STORAGE_KEYS = {
  MEALS: '@dogfam:meals_',
  FOOD_TYPES: '@dogfam:food_types_',
  FEEDING_SETTINGS: '@dogfam:feeding_settings_',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Управление приемами пищи
export const saveMeal = async (petId: string, meal: Omit<Meal, 'id'>) => {
  try {
    const meals = await getMeals(petId);
    const newMeal = { ...meal, id: generateId() };
    meals.push(newMeal);
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.MEALS}${petId}`,
      JSON.stringify(meals)
    );
    return newMeal;
  } catch (error) {
    console.error('Error saving meal:', error);
    throw error;
  }
};

export const getMeals = async (petId: string): Promise<Meal[]> => {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_KEYS.MEALS}${petId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting meals:', error);
    throw error;
  }
};

export const updateMeal = async (petId: string, meal: Meal) => {
  try {
    const meals = await getMeals(petId);
    const index = meals.findIndex(m => m.id === meal.id);
    if (index !== -1) {
      meals[index] = meal;
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MEALS}${petId}`,
        JSON.stringify(meals)
      );
    }
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

export const deleteMeal = async (petId: string, mealId: string) => {
  try {
    const meals = await getMeals(petId);
    const filteredMeals = meals.filter(meal => meal.id !== mealId);
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.MEALS}${petId}`,
      JSON.stringify(filteredMeals)
    );
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};

// Управление типами корма
export const saveFoodType = async (foodType: Omit<FoodType, 'id'>) => {
  try {
    const foodTypes = await getFoodTypes();
    const newFoodType = { ...foodType, id: generateId() };
    foodTypes.push(newFoodType);
    await AsyncStorage.setItem(STORAGE_KEYS.FOOD_TYPES, JSON.stringify(foodTypes));
    return newFoodType;
  } catch (error) {
    console.error('Error saving food type:', error);
    throw error;
  }
};

export const getFoodTypes = async (): Promise<FoodType[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_TYPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting food types:', error);
    throw error;
  }
};

export const updateFoodType = async (foodType: FoodType) => {
  try {
    const foodTypes = await getFoodTypes();
    const index = foodTypes.findIndex(ft => ft.id === foodType.id);
    if (index !== -1) {
      foodTypes[index] = foodType;
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_TYPES, JSON.stringify(foodTypes));
    }
  } catch (error) {
    console.error('Error updating food type:', error);
    throw error;
  }
};

export const deleteFoodType = async (foodTypeId: string) => {
  try {
    const foodTypes = await getFoodTypes();
    const filteredFoodTypes = foodTypes.filter(ft => ft.id !== foodTypeId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.FOOD_TYPES,
      JSON.stringify(filteredFoodTypes)
    );
  } catch (error) {
    console.error('Error deleting food type:', error);
    throw error;
  }
};

// Управление настройками кормления
export const saveFeedingSettings = async (
  petId: string,
  settings: FeedingSettings
) => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEYS.FEEDING_SETTINGS}${petId}`,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Error saving feeding settings:', error);
    throw error;
  }
};

export const getFeedingSettings = async (
  petId: string
): Promise<FeedingSettings> => {
  try {
    const data = await AsyncStorage.getItem(
      `${STORAGE_KEYS.FEEDING_SETTINGS}${petId}`
    );
    return data
      ? JSON.parse(data)
      : {
          activityLevel: 'medium',
          healthCondition: 'healthy',
          lifeStage: 'adult',
          petId,
          preferredFood: [],
        };
  } catch (error) {
    console.error('Error getting feeding settings:', error);
    throw error;
  }
};

export class MealStorage extends BaseStorage<Meal> {
  private static instances: Map<string, MealStorage> = new Map();

  private constructor(petId: string, date: string) {
    super(`${STORAGE_KEYS.MEALS}${petId}_${date}`, 'Meal');
  }

  static getInstance(petId: string, date: string): MealStorage {
    const key = `${petId}_${date}`;
    if (!this.instances.has(key)) {
      this.instances.set(key, new MealStorage(petId, date));
    }
    return this.instances.get(key)!;
  }

  async getMealsForDate(date: string): Promise<Meal[]> {
    const meals = await this.getAll();
    return meals.filter(meal => meal.date === date);
  }

  async updateMealCompletion(mealId: string, completed: boolean): Promise<Meal> {
    const meals = await this.getAll();
    const meal = meals.find(m => m.id === mealId);
    if (!meal) {
      throw new Error('Meal not found');
    }
    return this.save({ ...meal, completed });
  }
}

export class FeedingSettingsStorage extends BaseStorage<FeedingSettings> {
  private static instances: Map<string, FeedingSettingsStorage> = new Map();
  private static foodTypesInstance: FoodTypeStorage | null = null;

  private constructor(petId: string) {
    super(`${STORAGE_KEYS.FEEDING_SETTINGS}${petId}`, 'FeedingSettings');
  }

  static getInstance(petId: string): FeedingSettingsStorage {
    if (!this.instances.has(petId)) {
      this.instances.set(petId, new FeedingSettingsStorage(petId));
    }
    return this.instances.get(petId)!;
  }

  async getOrCreateSettings(petId: string): Promise<FeedingSettings> {
    const settings = await this.getAll();
    if (settings.length > 0) {
      return settings[0];
    }

    const defaultSettings: FeedingSettings = {
      id: this.generateId(),
      activityLevel: 'medium',
      healthCondition: 'healthy',
      lifeStage: 'adult',
      petId,
      preferredFood: [],
    };

    return this.save(defaultSettings);
  }

  static getFoodTypeStorage(): FoodTypeStorage {
    if (!this.foodTypesInstance) {
      this.foodTypesInstance = new FoodTypeStorage();
    }
    return this.foodTypesInstance;
  }
}

export class FoodTypeStorage extends BaseStorage<FoodType> {
  constructor() {
    super(STORAGE_KEYS.FOOD_TYPES, 'FoodType');
  }

  async getFoodTypes(): Promise<FoodType[]> {
    return this.getAll();
  }

  async saveFoodType(foodType: Omit<FoodType, 'id'>): Promise<FoodType> {
    const newFoodType: FoodType = {
      ...foodType,
      id: this.generateId(),
    };
    return this.save(newFoodType);
  }

  async deleteFoodType(id: string): Promise<void> {
    const foodTypes = await this.getAll();
    const updatedFoodTypes = foodTypes.filter(ft => ft.id !== id);
    await this.saveAll(updatedFoodTypes);
  }
} 