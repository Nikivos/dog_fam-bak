import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface WeatherData {
  temp: number;
  description: string;
  recommendation: string;
}

const getWeatherRecommendation = (temp: number): string => {
  if (temp < 0) {
    return 'Оденьте питомца потеплее и сократите прогулку';
  } else if (temp < 10) {
    return 'Прохладно, следите за активностью питомца';
  } else if (temp < 25) {
    return 'Отличная погода для прогулки!';
  } else {
    return 'Жарко, избегайте активности в пик жары';
  }
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Здесь будет запрос к API погоды
    // Пока используем моковые данные
    const mockWeather: WeatherData = {
      temp: 15,
      description: 'Облачно с прояснениями',
      recommendation: 'Отличная погода для прогулки!',
    };
    setWeather(mockWeather);
  }, []);

  if (!weather) return null;

  return (
    <View style={styles.container}>
      <View style={styles.weatherInfo}>
        <Ionicons name="partly-sunny" size={24} color="#007AFF" />
        <Text style={styles.temperature}>{weather.temp}°C</Text>
        <Text style={styles.description}>{weather.description}</Text>
      </View>
      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationTitle}>Рекомендация для прогулки:</Text>
        <Text style={styles.recommendation}>
          {getWeatherRecommendation(weather.temp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  recommendationContainer: {
    marginTop: 5,
  },
  recommendationTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  recommendation: {
    fontSize: 16,
    color: '#007AFF',
  },
}); 