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