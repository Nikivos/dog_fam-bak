export interface DogPark {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  rating: number;
  features: string[];
}

// Примерные координаты для Москвы
export const dogParks: DogPark[] = [
  {
    id: '1',
    name: 'Собачья площадка в Сокольниках',
    latitude: 55.794498,
    longitude: 37.677079,
    description: 'Большая огороженная площадка с тренажерами',
    rating: 4.5,
    features: ['Ограждение', 'Тренажеры', 'Освещение'],
  },
  {
    id: '2',
    name: 'Площадка в Измайловском',
    latitude: 55.796391,
    longitude: 37.748992,
    description: 'Площадка с отдельными зонами для больших и маленьких собак',
    rating: 4.8,
    features: ['Раздельные зоны', 'Поилки', 'Навесы'],
  },
  {
    id: '3',
    name: 'Площадка в Царицыно',
    latitude: 55.623150,
    longitude: 37.656547,
    description: 'Современная площадка с профессиональным оборудованием',
    rating: 4.7,
    features: ['Профессиональное оборудование', 'Освещение', 'Парковка'],
  },
]; 