import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalRecord, Vaccination, VetVisit } from '../types/medical';

const STORAGE_KEY = '@medical_records';

export class MedicalStorage {
  private static instance: MedicalStorage;
  private medicalRecord: MedicalRecord = {
    vaccinations: [],
    vetVisits: []
  };

  private constructor() {}

  static getInstance(): MedicalStorage {
    if (!MedicalStorage.instance) {
      MedicalStorage.instance = new MedicalStorage();
    }
    return MedicalStorage.instance;
  }

  async load() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        this.medicalRecord = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading medical records:', error);
    }
  }

  private async save() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.medicalRecord));
    } catch (error) {
      console.error('Error saving medical records:', error);
    }
  }

  async addVaccination(vaccination: Omit<Vaccination, 'id'>) {
    const newVaccination = {
      ...vaccination,
      id: Date.now().toString()
    };
    this.medicalRecord.vaccinations.push(newVaccination);
    await this.save();
    return newVaccination;
  }

  async addVetVisit(visit: Omit<VetVisit, 'id'>) {
    const newVisit = {
      ...visit,
      id: Date.now().toString()
    };
    this.medicalRecord.vetVisits.push(newVisit);
    await this.save();
    return newVisit;
  }

  async deleteVaccination(id: string) {
    this.medicalRecord.vaccinations = this.medicalRecord.vaccinations.filter(v => v.id !== id);
    await this.save();
  }

  async deleteVetVisit(id: string) {
    this.medicalRecord.vetVisits = this.medicalRecord.vetVisits.filter(v => v.id !== id);
    await this.save();
  }

  getVaccinations(): Vaccination[] {
    return [...this.medicalRecord.vaccinations].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getVetVisits(): VetVisit[] {
    return [...this.medicalRecord.vetVisits].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
} 