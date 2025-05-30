import AsyncStorage from '@react-native-async-storage/async-storage';
import { Walk } from '../types/walk';

const WALKS_STORAGE_KEY = '@dogfam:walks';

export class WalkStorage {
  private static instance: WalkStorage;
  private walks: Walk[] = [];

  private constructor() {}

  static getInstance(): WalkStorage {
    if (!WalkStorage.instance) {
      WalkStorage.instance = new WalkStorage();
    }
    return WalkStorage.instance;
  }

  async load(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(WALKS_STORAGE_KEY);
      if (data) {
        this.walks = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading walks:', error);
    }
  }

  async save(walk: Walk): Promise<void> {
    try {
      this.walks.push(walk);
      await AsyncStorage.setItem(WALKS_STORAGE_KEY, JSON.stringify(this.walks));
    } catch (error) {
      console.error('Error saving walk:', error);
      throw error;
    }
  }

  async getWalks(): Promise<Walk[]> {
    return this.walks;
  }

  async getWalksByPeriod(startDate: Date, endDate: Date): Promise<Walk[]> {
    return this.walks.filter(walk => {
      const walkDate = new Date(walk.startTime);
      return walkDate >= startDate && walkDate <= endDate;
    });
  }

  async getWalksByPetId(petId: string): Promise<Walk[]> {
    return this.walks.filter(walk => walk.petId === petId);
  }

  async deleteWalk(walkId: string): Promise<void> {
    try {
      this.walks = this.walks.filter(walk => walk.id !== walkId);
      await AsyncStorage.setItem(WALKS_STORAGE_KEY, JSON.stringify(this.walks));
    } catch (error) {
      console.error('Error deleting walk:', error);
      throw error;
    }
  }
} 