import { ActivityLevel, HealthCondition, LifeStage, PetRelatedEntity } from './common';

export type FoodCategory = 'dry' | 'wet' | 'raw' | 'homemade';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface FoodType extends PetRelatedEntity {
  name: string;
  brand: string;
  type: FoodCategory;
  calories: number;
  caloriesPerGram: number;
  description?: string;
}

export interface FeedingSettings extends PetRelatedEntity {
  dietType: 'dry' | 'wet' | 'raw' | 'mixed';
  mealsPerDay: number;
  portionSize: number;
  unit: 'g' | 'oz' | 'cups';
  caloriesPerPortion: number;
  specialNeeds: string[];
  restrictions: string[];
  preferredBrands: string[];
  activityLevel: ActivityLevel;
  notes?: string;
}

export interface Meal extends PetRelatedEntity {
  time: Date;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: {
    name: string;
    amount: number;
    unit: 'g' | 'oz' | 'cups';
    calories: number;
  }[];
  notes?: string;
  wasEaten: boolean;
  rating?: number;
}

export interface MealPlan extends PetRelatedEntity {
  startDate: Date;
  endDate: Date;
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
    foods: {
      foodId: string;
      amount: number;
      unit: 'g' | 'oz' | 'cups';
    }[];
  }[];
  totalCalories: number;
  notes?: string;
} 