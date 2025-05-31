import { PetRelatedEntity } from './common';

export interface Exercise extends PetRelatedEntity {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'obedience' | 'agility' | 'tricks' | 'behavior';
  duration: number; // в минутах
  steps: string[];
  tips: string[];
  video?: string;
  prerequisites?: string[];
}

export interface TrainingSession extends PetRelatedEntity {
  startTime: Date;
  endTime?: Date;
  duration: number;
  exercises: {
    exerciseId: string;
    completed: boolean;
    performance: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  }[];
  mood: 'excited' | 'focused' | 'distracted' | 'tired';
  location: 'home' | 'outdoors' | 'training_facility';
  notes?: string;
}

export interface TrainingProgress extends PetRelatedEntity {
  exercise: string;
  level: number;
  totalSessions: number;
  successRate: number;
  history: {
    date: Date;
    performance: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  }[];
  goals: {
    targetLevel: number;
    targetDate: Date;
    achieved: boolean;
  }[];
}

export interface TrainingPlan extends PetRelatedEntity {
  name: string;
  description: string;
  duration: number; // в неделях
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  schedule: {
    dayOfWeek: number;
    exercises: {
      exerciseId: string;
      duration: number;
      repetitions: number;
    }[];
  }[];
  goals: string[];
  notes?: string;
} 