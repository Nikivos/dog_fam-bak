type ActivityLevel = 'low' | 'normal' | 'high';
type HealthCondition = 'healthy' | 'overweight' | 'underweight' | 'pregnant' | 'nursing';
type LifeStage = 'puppy' | 'adult' | 'senior';

const ACTIVITY_MULTIPLIERS = {
  low: 1.2, // Малоподвижный образ жизни
  normal: 1.4, // Обычная активность
  high: 1.8, // Высокая активность
};

const HEALTH_MULTIPLIERS = {
  healthy: 1.0,
  overweight: 0.8, // Снижение калорий для похудения
  underweight: 1.2, // Увеличение калорий для набора веса
  pregnant: 1.5, // Беременность
  nursing: 2.0, // Кормление щенков
};

const LIFE_STAGE_MULTIPLIERS = {
  puppy: 2.0, // Растущие щенки требуют больше энергии
  adult: 1.0,
  senior: 0.8, // Пожилые собаки требуют меньше энергии
};

/**
 * Рассчитывает базовый уровень метаболизма (RER)
 * @param weightKg вес собаки в кг
 */
export const calculateRER = (weightKg: number): number => {
  return 70 * Math.pow(weightKg, 0.75);
};

interface CalorieParams {
  weightKg: number;
  activityLevel: 'low' | 'medium' | 'high';
  healthCondition: 'healthy' | 'overweight' | 'underweight';
  lifeStage: 'puppy' | 'adult' | 'senior';
}

export function calculateDailyCalories(params: CalorieParams): number {
  const { weightKg, activityLevel, healthCondition, lifeStage } = params;

  // Базовый расчет: 30 * вес + 70 для взрослой здоровой собаки
  let baseCalories = 30 * weightKg + 70;

  // Коэффициенты активности
  const activityMultiplier = {
    low: 1.2,
    medium: 1.4,
    high: 1.6,
  }[activityLevel];

  // Коэффициенты состояния здоровья
  const healthMultiplier = {
    healthy: 1.0,
    overweight: 0.8,
    underweight: 1.2,
  }[healthCondition];

  // Коэффициенты возраста
  const lifeStageMultiplier = {
    puppy: 2.0,
    adult: 1.0,
    senior: 0.8,
  }[lifeStage];

  // Итоговый расчет
  const dailyCalories = baseCalories * activityMultiplier * healthMultiplier * lifeStageMultiplier;

  return Math.round(dailyCalories);
}

/**
 * Рассчитывает рекомендуемый размер порции в граммах
 */
export const calculatePortionSize = (
  dailyCalories: number,
  foodCaloriesPer100g: number,
  mealsPerDay: number
): number => {
  const dailyGrams = (dailyCalories / foodCaloriesPer100g) * 100;
  return Math.round(dailyGrams / mealsPerDay);
};

/**
 * Возвращает рекомендации по кормлению
 */
export const getFeedingRecommendations = (
  dailyCalories: number,
  lifeStage: LifeStage
): string[] => {
  const recommendations: string[] = [];

  if (lifeStage === 'puppy') {
    recommendations.push(
      'Кормите щенка 3-4 раза в день',
      'Используйте специальный корм для щенков',
      'Следите за темпами роста'
    );
  } else if (lifeStage === 'adult') {
    recommendations.push(
      'Кормите собаку 2 раза в день',
      'Придерживайтесь регулярного расписания',
      'Следите за весом питомца'
    );
  } else {
    recommendations.push(
      'Кормите пожилую собаку 2-3 раза в день небольшими порциями',
      'Используйте корм для пожилых собак',
      'Регулярно взвешивайте питомца'
    );
  }

  return recommendations;
}; 