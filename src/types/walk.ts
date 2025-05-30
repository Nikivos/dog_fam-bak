export interface WalkLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Walk {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // в секундах
  distance: number; // в метрах
  path: WalkLocation[];
  petId: string;
  averageSpeed: number; // м/с
} 