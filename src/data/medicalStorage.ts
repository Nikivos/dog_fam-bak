import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const STORAGE_KEY = '@medical_records';

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  type: 'Ежегодная' | 'Срочная';
}

export interface VetVisit {
  id: string;
  date: string;
  reason: string;
  doctor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  diagnosis?: string;
  prescriptions?: string;
  symptoms?: string;
}

export interface MedicalRecord {
  vaccinations: Vaccination[];
  vetVisits: VetVisit[];
}

const TEST_DATA: MedicalRecord = {
  vaccinations: [
    {
      id: '1',
      name: 'Бешенство',
      date: '2024-03-15',
      nextDate: '2025-03-15',
      type: 'Ежегодная',
    },
    {
      id: '2',
      name: 'Комплексная DHPP',
      date: '2024-02-01',
      nextDate: '2025-02-01',
      type: 'Ежегодная',
    },
    {
      id: '3',
      name: 'Лептоспироз',
      date: '2024-03-20',
      nextDate: '2024-03-27',
      type: 'Срочная',
    },
  ],
  vetVisits: [
    {
      id: '1',
      date: '2024-03-25',
      reason: 'Плановый осмотр',
      doctor: 'Др. Иванов',
      status: 'scheduled',
    },
    {
      id: '2',
      date: format(new Date(), 'yyyy-MM-dd'),
      reason: 'Вакцинация',
      doctor: 'Др. Петрова',
      status: 'scheduled',
    },
    {
      id: '3',
      date: '2024-03-10',
      reason: 'Чипирование',
      doctor: 'Др. Сидоров',
      status: 'completed',
      diagnosis: 'Здоров',
      prescriptions: 'Наблюдение',
    },
  ],
};

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
      } else {
        // Initialize with test data if no data exists
        this.medicalRecord = TEST_DATA;
        await this.save();
      }
    } catch (error) {
      console.error('Error loading medical records:', error);
      // Initialize with test data on error
      this.medicalRecord = TEST_DATA;
      await this.save();
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

  async updateVaccination(id: string, vaccination: Omit<Vaccination, 'id'>) {
    const index = this.medicalRecord.vaccinations.findIndex(v => v.id === id);
    if (index !== -1) {
      this.medicalRecord.vaccinations[index] = {
        ...vaccination,
        id,
      };
      await this.save();
      return this.medicalRecord.vaccinations[index];
    }
    throw new Error('Vaccination not found');
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

  async updateVetVisit(id: string, visit: Omit<VetVisit, 'id'>) {
    const index = this.medicalRecord.vetVisits.findIndex(v => v.id === id);
    if (index !== -1) {
      this.medicalRecord.vetVisits[index] = {
        ...visit,
        id,
      };
      await this.save();
      return this.medicalRecord.vetVisits[index];
    }
    throw new Error('Visit not found');
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