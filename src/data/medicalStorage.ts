import { BaseStorage, BaseEntity } from './baseStorage';

export interface Vaccination extends BaseEntity {
  name: string;
  date: string;
  nextDate: string;
  notes?: string;
  petId: string;
}

export interface Deworming extends BaseEntity {
  date: string;
  medicine: string;
  nextDate: string;
  notes?: string;
  petId: string;
}

export interface VetVisit extends BaseEntity {
  date: string;
  reason: string;
  diagnosis?: string;
  prescription?: string;
  nextVisit?: string;
  notes?: string;
  petId: string;
}

export interface Medication extends BaseEntity {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  petId: string;
}

export interface HealthCondition extends BaseEntity {
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved';
  notes?: string;
  petId: string;
}

const STORAGE_KEYS = {
  VACCINATIONS: '@dogfam:vaccinations_',
  DEWORMING: '@dogfam:deworming_',
  VET_VISITS: '@dogfam:vet_visits_',
  MEDICATIONS: '@dogfam:medications_',
  HEALTH_CONDITIONS: '@dogfam:health_conditions_',
};

export class VaccinationStorage extends BaseStorage<Vaccination> {
  private static instances: Map<string, VaccinationStorage> = new Map();

  private constructor(petId: string) {
    super(`${STORAGE_KEYS.VACCINATIONS}${petId}`, 'Vaccination');
  }

  static getInstance(petId: string): VaccinationStorage {
    if (!this.instances.has(petId)) {
      this.instances.set(petId, new VaccinationStorage(petId));
    }
    return this.instances.get(petId)!;
  }
}

export class DewormingStorage extends BaseStorage<Deworming> {
  private static instances: Map<string, DewormingStorage> = new Map();

  private constructor(petId: string) {
    super(`${STORAGE_KEYS.DEWORMING}${petId}`, 'Deworming');
  }

  static getInstance(petId: string): DewormingStorage {
    if (!this.instances.has(petId)) {
      this.instances.set(petId, new DewormingStorage(petId));
    }
    return this.instances.get(petId)!;
  }
}

export class VetVisitStorage extends BaseStorage<VetVisit> {
  private static instances: Map<string, VetVisitStorage> = new Map();

  private constructor(petId: string) {
    super(`${STORAGE_KEYS.VET_VISITS}${petId}`, 'VetVisit');
  }

  static getInstance(petId: string): VetVisitStorage {
    if (!this.instances.has(petId)) {
      this.instances.set(petId, new VetVisitStorage(petId));
    }
    return this.instances.get(petId)!;
  }
}

export class MedicationStorage extends BaseStorage<Medication> {
  private static instances: Map<string, MedicationStorage> = new Map();

  private constructor(petId: string) {
    super(`${STORAGE_KEYS.MEDICATIONS}${petId}`, 'Medication');
  }

  static getInstance(petId: string): MedicationStorage {
    if (!this.instances.has(petId)) {
      this.instances.set(petId, new MedicationStorage(petId));
    }
    return this.instances.get(petId)!;
  }
}

export class HealthConditionStorage extends BaseStorage<HealthCondition> {
  private static instances: Map<string, HealthConditionStorage> = new Map();

  private constructor(petId: string) {
    super(`${STORAGE_KEYS.HEALTH_CONDITIONS}${petId}`, 'HealthCondition');
  }

  static getInstance(petId: string): HealthConditionStorage {
    if (!this.instances.has(petId)) {
      this.instances.set(petId, new HealthConditionStorage(petId));
    }
    return this.instances.get(petId)!;
  }
} 