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

/**
 * Рассчитывает дневную потребность в калориях
 */
export const calculateDailyCalories = ({
  weightKg,
  activityLevel,
  healthCondition,
  lifeStage,
}: {
  weightKg: number;
  activityLevel: ActivityLevel;
  healthCondition: HealthCondition;
  lifeStage: LifeStage;
}): number => {
  const rer = calculateRER(weightKg);
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const healthMultiplier = HEALTH_MULTIPLIERS[healthCondition];
  const lifeStageMultiplier = LIFE_STAGE_MULTIPLIERS[lifeStage];

  return Math.round(rer * activityMultiplier * healthMultiplier * lifeStageMultiplier);
};

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