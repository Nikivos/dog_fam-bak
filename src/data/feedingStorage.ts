import AsyncStorage from '@react-native-async-storage/async-storage';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface BaseEntity {
  id: string;
}

export interface Meal extends BaseEntity {
  type: MealType;
  time: string;
  amount: number;
  calories: number;
  completed: boolean;
}

export interface FeedingSettings extends BaseEntity {
  activityLevel: 'low' | 'medium' | 'high';
  healthCondition: 'healthy' | 'overweight' | 'underweight';
  lifeStage: 'puppy' | 'adult' | 'senior';
  petId: string;
}

export interface FoodType extends BaseEntity {
  name: string;
  calories: number;
  description?: string;
}

const STORAGE_KEYS = {
  MEALS: '@dogfam:meals_',
  FOOD_TYPES: '@dogfam:food_types_',
  FEEDING_SETTINGS: '@dogfam:feeding_settings_',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export class MealStorage {
  private static instance: MealStorage;
  private meals: Meal[] = [];

  private constructor() {}

  static getInstance(): MealStorage {
    if (!MealStorage.instance) {
      MealStorage.instance = new MealStorage();
    }
    return MealStorage.instance;
  }

  async load(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('meals');
      if (data) {
        this.meals = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  }

  async save(): Promise<void> {
    try {
      await AsyncStorage.setItem('meals', JSON.stringify(this.meals));
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  }

  getMealsForDate(date: Date): Meal[] {
    const dateString = date.toISOString().split('T')[0];
    return this.meals.filter(meal => meal.time.startsWith(dateString));
  }

  async saveMeal(meal: Meal): Promise<void> {
    const index = this.meals.findIndex(m => m.id === meal.id);
    if (index >= 0) {
      this.meals[index] = meal;
    } else {
      this.meals.push(meal);
    }
    await this.save();
  }

  async updateMeal(meal: Meal): Promise<void> {
    const index = this.meals.findIndex(m => m.id === meal.id);
    if (index >= 0) {
      this.meals[index] = meal;
      await this.save();
    }
  }

  async deleteMeal(id: string): Promise<void> {
    this.meals = this.meals.filter(meal => meal.id !== id);
    await this.save();
  }
}

export class FeedingSettingsStorage {
  private static instance: FeedingSettingsStorage;
  private settings: FeedingSettings | null = null;

  private constructor() {}

  static getInstance(): FeedingSettingsStorage {
    if (!FeedingSettingsStorage.instance) {
      FeedingSettingsStorage.instance = new FeedingSettingsStorage();
    }
    return FeedingSettingsStorage.instance;
  }

  async load(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('feedingSettings');
      if (data) {
        this.settings = JSON.parse(data);
      } else {
        this.settings = {
          id: 'default',
          petId: 'default',
          activityLevel: 'medium',
          healthCondition: 'healthy',
          lifeStage: 'adult',
        };
      }
    } catch (error) {
      console.error('Error loading feeding settings:', error);
    }
  }

  getSettings(): FeedingSettings {
    if (!this.settings) {
      throw new Error('Settings not loaded');
    }
    return this.settings;
  }

  async saveSettings(settings: FeedingSettings): Promise<void> {
    try {
      this.settings = settings;
      await AsyncStorage.setItem('feedingSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving feeding settings:', error);
    }
  }
}

export class FoodTypeStorage {
  private static instance: FoodTypeStorage;
  private foodTypes: FoodType[] = [];

  private constructor() {}

  static getInstance(): FoodTypeStorage {
    if (!FoodTypeStorage.instance) {
      FoodTypeStorage.instance = new FoodTypeStorage();
    }
    return FoodTypeStorage.instance;
  }

  async load(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('foodTypes');
      if (data) {
        this.foodTypes = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading food types:', error);
    }
  }

  async save(): Promise<void> {
    try {
      await AsyncStorage.setItem('foodTypes', JSON.stringify(this.foodTypes));
    } catch (error) {
      console.error('Error saving food types:', error);
    }
  }

  getFoodTypes(): FoodType[] {
    return this.foodTypes;
  }

  async addFoodType(foodType: FoodType): Promise<void> {
    this.foodTypes.push(foodType);
    await this.save();
  }

  async updateFoodType(foodType: FoodType): Promise<void> {
    const index = this.foodTypes.findIndex(ft => ft.id === foodType.id);
    if (index >= 0) {
      this.foodTypes[index] = foodType;
      await this.save();
    }
  }

  async deleteFoodType(id: string): Promise<void> {
    this.foodTypes = this.foodTypes.filter(ft => ft.id !== id);
    await this.save();
  }
}

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