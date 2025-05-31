import * as Location from 'expo-location';

const API_KEY = 'YOUR_WEATHER_API_KEY'; // Нужно будет заменить на реальный ключ
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

export class WeatherService {
  private static instance: WeatherService;

  private constructor() {}

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(): Promise<WeatherData> {
    try {
      // Запрашиваем разрешение на использование геолокации
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      // Получаем текущую локацию
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Запрашиваем погоду
      const response = await fetch(
        `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        condition: this.translateCondition(data.weather[0].main),
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return {
        temperature: 20,
        condition: 'Нет данных',
        icon: '01d',
      };
    }
  }

  private translateCondition(condition: string): string {
    const translations: { [key: string]: string } = {
      'Clear': 'Ясно',
      'Clouds': 'Облачно',
      'Rain': 'Дождь',
      'Snow': 'Снег',
      'Thunderstorm': 'Гроза',
      'Drizzle': 'Морось',
      'Mist': 'Туман',
    };
    return translations[condition] || condition;
  }
} 