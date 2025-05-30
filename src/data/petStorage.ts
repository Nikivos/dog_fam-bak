import { BaseStorage } from './baseStorage';
import { Pet } from '../types/pet';

const PETS_STORAGE_KEY = '@dogfam:pets';

export class PetStorage extends BaseStorage<Pet> {
  private static instance: PetStorage;

  private constructor() {
    super(PETS_STORAGE_KEY, 'Pet');
  }

  static getInstance(): PetStorage {
    if (!PetStorage.instance) {
      PetStorage.instance = new PetStorage();
    }
    return PetStorage.instance;
  }

  async getAllPets(): Promise<Pet[]> {
    return this.getAll();
  }

  async savePet(pet: Omit<Pet, 'id'> & Partial<Pick<Pet, 'id'>>): Promise<Pet> {
    return this.save(pet);
  }

  async deletePet(petId: string): Promise<void> {
    return this.delete(petId);
  }
} 