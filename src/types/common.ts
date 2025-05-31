// Базовые типы для всего приложения

// Базовые интерфейсы
export interface BaseEntity {
  id: string;
}

export interface TimestampedEntity extends BaseEntity {
  createdAt: string;
  updatedAt: string;
}

export interface PetRelatedEntity extends TimestampedEntity {
  petId: string;
}

// Общие перечисления
export type HealthCondition = 'healthy' | 'overweight' | 'underweight' | 'sick' | 'recovering';
export type ActivityLevel = 'low' | 'medium' | 'high';
export type LifeStage = 'puppy' | 'adult' | 'senior';
export type Gender = 'male' | 'female';

// Типы для обработки ошибок
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'STORAGE_ERROR', cause);
    this.name = 'StorageError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
} 