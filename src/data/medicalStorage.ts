import AsyncStorage from '@react-native-async-storage/async-storage';

export type Vaccination = {
  id: string;
  petId: string;
  name: string; // Название вакцины
  date: string; // Дата вакцинации
  nextDate: string; // Дата следующей вакцинации
  veterinarian: string; // Врач
  clinic: string; // Клиника
  notes?: string; // Дополнительные заметки
};

export type Deworming = {
  id: string;
  petId: string;
  medicine: string; // Название препарата
  date: string; // Дата дегельминтизации
  nextDate: string; // Дата следующей дегельминтизации
  dosage: string; // Дозировка
  notes?: string; // Дополнительные заметки
};

export type VetVisit = {
  id: string;
  petId: string;
  date: string;
  reason: string; // Причина визита
  diagnosis?: string; // Диагноз
  treatment?: string; // Назначенное лечение
  veterinarian: string;
  clinic: string;
  nextVisitDate?: string; // Дата следующего визита
  notes?: string;
};

export type Medication = {
  id: string;
  petId: string;
  name: string; // Название препарата
  startDate: string;
  endDate?: string;
  dosage: string; // Дозировка
  frequency: string; // Частота приема (например, "2 раза в день")
  purpose: string; // Цель приема
  prescribedBy: string; // Кто назначил
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
};

export type HealthCondition = {
  id: string;
  petId: string;
  name: string; // Название заболевания/аллергии
  type: 'allergy' | 'chronic' | 'other';
  diagnosedDate: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  triggers?: string[]; // Триггеры для аллергий
  treatment?: string; // Текущее лечение
  notes?: string;
};

const STORAGE_KEYS = {
  VACCINATIONS: '@dogfam/vaccinations',
  DEWORMING: '@dogfam/deworming',
  VET_VISITS: '@dogfam/vet_visits',
  MEDICATIONS: '@dogfam/medications',
  HEALTH_CONDITIONS: '@dogfam/health_conditions',
} as const;

export class MedicalStorage {
  // Вакцинации
  static async getVaccinations(petId: string): Promise<Vaccination[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.VACCINATIONS);
      if (!stored) return [];
      
      const vaccinations: Vaccination[] = JSON.parse(stored);
      return vaccinations.filter(v => v.petId === petId);
    } catch (error) {
      console.error('Error getting vaccinations:', error);
      return [];
    }
  }

  static async saveVaccination(vaccination: Vaccination): Promise<void> {
    try {
      const vaccinations = await this.getVaccinations(vaccination.petId);
      const existingIndex = vaccinations.findIndex(v => v.id === vaccination.id);
      
      if (existingIndex !== -1) {
        vaccinations[existingIndex] = vaccination;
      } else {
        vaccinations.push(vaccination);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(vaccinations));
    } catch (error) {
      console.error('Error saving vaccination:', error);
    }
  }

  static async deleteVaccination(id: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.VACCINATIONS);
      if (!stored) return;

      const vaccinations: Vaccination[] = JSON.parse(stored);
      const filtered = vaccinations.filter(v => v.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting vaccination:', error);
    }
  }

  // Дегельминтизация
  static async getDeworming(petId: string): Promise<Deworming[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DEWORMING);
      if (!stored) return [];
      
      const deworming: Deworming[] = JSON.parse(stored);
      return deworming.filter(d => d.petId === petId);
    } catch (error) {
      console.error('Error getting deworming:', error);
      return [];
    }
  }

  static async saveDeworming(deworming: Deworming): Promise<void> {
    try {
      const allDeworming = await this.getDeworming(deworming.petId);
      const existingIndex = allDeworming.findIndex(d => d.id === deworming.id);
      
      if (existingIndex !== -1) {
        allDeworming[existingIndex] = deworming;
      } else {
        allDeworming.push(deworming);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.DEWORMING, JSON.stringify(allDeworming));
    } catch (error) {
      console.error('Error saving deworming:', error);
    }
  }

  // Визиты к ветеринару
  static async getVetVisits(petId: string): Promise<VetVisit[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.VET_VISITS);
      if (!stored) return [];
      
      const visits: VetVisit[] = JSON.parse(stored);
      return visits.filter(v => v.petId === petId);
    } catch (error) {
      console.error('Error getting vet visits:', error);
      return [];
    }
  }

  static async saveVetVisit(visit: VetVisit): Promise<void> {
    try {
      const visits = await this.getVetVisits(visit.petId);
      const existingIndex = visits.findIndex(v => v.id === visit.id);
      
      if (existingIndex !== -1) {
        visits[existingIndex] = visit;
      } else {
        visits.push(visit);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.VET_VISITS, JSON.stringify(visits));
    } catch (error) {
      console.error('Error saving vet visit:', error);
    }
  }

  // Медикаменты
  static async getMedications(petId: string): Promise<Medication[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      if (!stored) return [];
      
      const medications: Medication[] = JSON.parse(stored);
      return medications.filter(m => m.petId === petId);
    } catch (error) {
      console.error('Error getting medications:', error);
      return [];
    }
  }

  static async saveMedication(medication: Medication): Promise<void> {
    try {
      const medications = await this.getMedications(medication.petId);
      const existingIndex = medications.findIndex(m => m.id === medication.id);
      
      if (existingIndex !== -1) {
        medications[existingIndex] = medication;
      } else {
        medications.push(medication);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  }

  // Хронические заболевания и аллергии
  static async getHealthConditions(petId: string): Promise<HealthCondition[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_CONDITIONS);
      if (!stored) return [];
      
      const conditions: HealthCondition[] = JSON.parse(stored);
      return conditions.filter(c => c.petId === petId);
    } catch (error) {
      console.error('Error getting health conditions:', error);
      return [];
    }
  }

  static async saveHealthCondition(condition: HealthCondition): Promise<void> {
    try {
      const conditions = await this.getHealthConditions(condition.petId);
      const existingIndex = conditions.findIndex(c => c.id === condition.id);
      
      if (existingIndex !== -1) {
        conditions[existingIndex] = condition;
      } else {
        conditions.push(condition);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.HEALTH_CONDITIONS, JSON.stringify(conditions));
    } catch (error) {
      console.error('Error saving health condition:', error);
    }
  }

  // Вспомогательные функции
  static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 