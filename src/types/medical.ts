export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  type: string;
}

export interface VetVisit {
  id: string;
  date: string;
  reason: string;
  doctor: string;
  status: 'completed' | 'scheduled';
}

export interface MedicalRecord {
  vaccinations: Vaccination[];
  vetVisits: VetVisit[];
} 