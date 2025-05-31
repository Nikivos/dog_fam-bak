import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export interface Achievement {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  progress: number;
  color: string;
  total: number;
  current: number;
}

const STORAGE_KEY = '@achievements';

export class AchievementsService {
  private static instance: AchievementsService;
  private achievements: Achievement[] = [];

  private constructor() {}

  static getInstance(): AchievementsService {
    if (!AchievementsService.instance) {
      AchievementsService.instance = new AchievementsService();
    }
    return AchievementsService.instance;
  }

  async load() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        this.achievements = JSON.parse(data);
      } else {
        // Инициализируем базовые достижения
        this.achievements = [
          {
            id: '1',
            icon: 'paw',
            title: 'Прогулки',
            progress: 0,
            color: '#6FCF97',
            total: 100,
            current: 0,
          },
          {
            id: '2',
            icon: 'restaurant',
            title: 'Питание',
            progress: 0,
            color: '#F2994A',
            total: 90,
            current: 0,
          },
          {
            id: '3',
            icon: 'medical',
            title: 'Здоровье',
            progress: 0,
            color: '#5568FE',
            total: 10,
            current: 0,
          },
          {
            id: '4',
            icon: 'trophy',
            title: 'Тренировки',
            progress: 0,
            color: '#9B51E0',
            total: 50,
            current: 0,
          },
        ];
        await this.save();
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }

  private async save() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  async updateAchievement(id: string, current: number) {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement) {
      achievement.current = Math.min(current, achievement.total);
      achievement.progress = achievement.current / achievement.total;
      await this.save();
    }
  }

  async incrementAchievement(id: string, amount: number = 1) {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement) {
      achievement.current = Math.min(achievement.current + amount, achievement.total);
      achievement.progress = achievement.current / achievement.total;
      await this.save();
    }
  }
} 