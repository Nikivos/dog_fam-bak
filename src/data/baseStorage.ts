import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BaseEntity {
  id: string;
}

export abstract class BaseStorage<T extends BaseEntity> {
  protected constructor(
    private readonly storageKey: string,
    private readonly entityName: string
  ) {}

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public createId(): string {
    return this.generateId();
  }

  async getAll(): Promise<T[]> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      const items = data ? JSON.parse(data) : [];
      console.log(`Retrieved ${this.entityName}:`, items);
      return items;
    } catch (error) {
      console.error(`Error loading ${this.entityName}:`, error);
      return [];
    }
  }

  async save(item: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T> {
    try {
      const items = await this.getAll();
      const newItem = {
        ...item,
        id: item.id || this.generateId(),
      } as T;

      const existingIndex = items.findIndex(i => (i as T).id === newItem.id);
      
      if (existingIndex >= 0) {
        console.log(`Updating existing ${this.entityName} at index:`, existingIndex);
        items[existingIndex] = newItem;
      } else {
        console.log(`Adding new ${this.entityName}`);
        items.push(newItem);
      }

      await AsyncStorage.setItem(this.storageKey, JSON.stringify(items));
      console.log(`${this.entityName} saved successfully`);
      return newItem;
    } catch (error) {
      console.error(`Error saving ${this.entityName}:`, error);
      throw error;
    }
  }

  async saveAll(entities: T[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(entities));
    } catch (error) {
      console.error(`Error saving ${this.entityName}s:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const items = await this.getAll();
      console.log(`Deleting ${this.entityName} with ID:`, id);
      const filteredItems = items.filter(item => item.id !== id);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
      console.log(`${this.entityName} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${this.entityName}:`, error);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
      console.log(`All ${this.entityName} cleared successfully`);
    } catch (error) {
      console.error(`Error deleting all ${this.entityName}s:`, error);
      throw error;
    }
  }
} 