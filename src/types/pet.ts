export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDate: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  description: string;
  doctor: string;
  clinic: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  weight: number;
  photo: string;
  gender: 'male' | 'female';
  vaccinations: Vaccination[];
  medicalRecords: MedicalRecord[];
  chipNumber?: string;
  allergies: string[];
  specialNeeds?: string;
} 