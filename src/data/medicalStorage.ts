import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  notes?: string;
}

export interface Deworming {
  id: string;
  date: string;
  medicine: string;
  nextDate: string;
  notes?: string;
}

export interface VetVisit {
  id: string;
  date: string;
  reason: string;
  diagnosis?: string;
  prescription?: string;
  nextVisit?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved';
  notes?: string;
}

const STORAGE_KEYS = {
  VACCINATIONS: 'dogfam_vaccinations_',
  DEWORMING: 'dogfam_deworming_',
  VET_VISITS: 'dogfam_vet_visits_',
  MEDICATIONS: 'dogfam_medications_',
  HEALTH_CONDITIONS: 'dogfam_health_conditions_',
};

// Генерация уникального ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Вакцинации
export const saveVaccination = async (petId: string, vaccination: Omit<Vaccination, 'id'>) => {
  try {
    const key = `${STORAGE_KEYS.VACCINATIONS}${petId}`;
    const existingData = await AsyncStorage.getItem(key);
    const vaccinations: Vaccination[] = existingData ? JSON.parse(existingData) : [];
    
    const newVaccination = {
      ...vaccination,
      id: generateId(),
    };
    
    vaccinations.push(newVaccination);
    await AsyncStorage.setItem(key, JSON.stringify(vaccinations));
    return newVaccination;
  } catch (error) {
    console.error('Error saving vaccination:', error);
    throw error;
  }
};

export const getVaccinations = async (petId: string): Promise<Vaccination[]> => {
  try {
    const key = `${STORAGE_KEYS.VACCINATIONS}${petId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting vaccinations:', error);
    throw error;
  }
};

// Дегельминтизация
export const saveDeworming = async (petId: string, deworming: Omit<Deworming, 'id'>) => {
  try {
    const key = `${STORAGE_KEYS.DEWORMING}${petId}`;
    const existingData = await AsyncStorage.getItem(key);
    const dewormings: Deworming[] = existingData ? JSON.parse(existingData) : [];
    
    const newDeworming = {
      ...deworming,
      id: generateId(),
    };
    
    dewormings.push(newDeworming);
    await AsyncStorage.setItem(key, JSON.stringify(dewormings));
    return newDeworming;
  } catch (error) {
    console.error('Error saving deworming:', error);
    throw error;
  }
};

export const getDewormings = async (petId: string): Promise<Deworming[]> => {
  try {
    const key = `${STORAGE_KEYS.DEWORMING}${petId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting dewormings:', error);
    throw error;
  }
};

// Визиты к ветеринару
export const saveVetVisit = async (petId: string, visit: Omit<VetVisit, 'id'>) => {
  try {
    const key = `${STORAGE_KEYS.VET_VISITS}${petId}`;
    const existingData = await AsyncStorage.getItem(key);
    const visits: VetVisit[] = existingData ? JSON.parse(existingData) : [];
    
    const newVisit = {
      ...visit,
      id: generateId(),
    };
    
    visits.push(newVisit);
    await AsyncStorage.setItem(key, JSON.stringify(visits));
    return newVisit;
  } catch (error) {
    console.error('Error saving vet visit:', error);
    throw error;
  }
};

export const getVetVisits = async (petId: string): Promise<VetVisit[]> => {
  try {
    const key = `${STORAGE_KEYS.VET_VISITS}${petId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting vet visits:', error);
    throw error;
  }
};

// Медикаменты
export const saveMedication = async (petId: string, medication: Omit<Medication, 'id'>) => {
  try {
    const key = `${STORAGE_KEYS.MEDICATIONS}${petId}`;
    const existingData = await AsyncStorage.getItem(key);
    const medications: Medication[] = existingData ? JSON.parse(existingData) : [];
    
    const newMedication = {
      ...medication,
      id: generateId(),
    };
    
    medications.push(newMedication);
    await AsyncStorage.setItem(key, JSON.stringify(medications));
    return newMedication;
  } catch (error) {
    console.error('Error saving medication:', error);
    throw error;
  }
};

export const getMedications = async (petId: string): Promise<Medication[]> => {
  try {
    const key = `${STORAGE_KEYS.MEDICATIONS}${petId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting medications:', error);
    throw error;
  }
};

// Состояния здоровья
export const saveHealthCondition = async (petId: string, condition: Omit<HealthCondition, 'id'>) => {
  try {
    const key = `${STORAGE_KEYS.HEALTH_CONDITIONS}${petId}`;
    const existingData = await AsyncStorage.getItem(key);
    const conditions: HealthCondition[] = existingData ? JSON.parse(existingData) : [];
    
    const newCondition = {
      ...condition,
      id: generateId(),
    };
    
    conditions.push(newCondition);
    await AsyncStorage.setItem(key, JSON.stringify(conditions));
    return newCondition;
  } catch (error) {
    console.error('Error saving health condition:', error);
    throw error;
  }
};

export const getHealthConditions = async (petId: string): Promise<HealthCondition[]> => {
  try {
    const key = `${STORAGE_KEYS.HEALTH_CONDITIONS}${petId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting health conditions:', error);
    throw error;
  }
}; 