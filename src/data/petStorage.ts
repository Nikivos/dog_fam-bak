import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../types/pet';

const PETS_STORAGE_KEY = '@dogfam:pets';

export const PetStorage = {
  async getAllPets(): Promise<Pet[]> {
    try {
      const petsJson = await AsyncStorage.getItem(PETS_STORAGE_KEY);
      const pets = petsJson ? JSON.parse(petsJson) : [];
      console.log('Retrieved pets from storage:', pets);
      return pets;
    } catch (error) {
      console.error('Error loading pets:', error);
      return [];
    }
  },

  async savePet(pet: Pet): Promise<void> {
    try {
      const pets = await this.getAllPets();
      console.log('Current pets in storage:', pets);
      
      const existingPetIndex = pets.findIndex(p => p.id === pet.id);
      
      if (existingPetIndex >= 0) {
        console.log('Updating existing pet at index:', existingPetIndex);
        pets[existingPetIndex] = pet;
      } else {
        console.log('Adding new pet');
        pet.id = Date.now().toString(); // Simple ID generation
        pets.push(pet);
      }

      const petsJson = JSON.stringify(pets);
      console.log('Saving pets to storage:', petsJson);
      await AsyncStorage.setItem(PETS_STORAGE_KEY, petsJson);
      console.log('Pets saved successfully');
    } catch (error) {
      console.error('Error saving pet:', error);
      throw error;
    }
  },

  async deletePet(petId: string): Promise<void> {
    try {
      const pets = await this.getAllPets();
      console.log('Deleting pet with ID:', petId);
      const filteredPets = pets.filter(p => p.id !== petId);
      await AsyncStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(filteredPets));
      console.log('Pet deleted successfully');
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  }
}; 