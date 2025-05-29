import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { formatDuration } from '../utils/timeUtils';

type LocationPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export const WalkTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  
  const locationSubscription = useRef<any>(null);
  const timerInterval = useRef<any>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Для отслеживания прогулки необходим доступ к геолокации');
        return;
      }

      // Получаем текущую локацию
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const initialPoint: LocationPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };

      setCurrentLocation(initialPoint);
      setRoute([initialPoint]);
      setIsTracking(true);
      setDuration(0);

      // Запускаем таймер
      timerInterval.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Подписываемся на обновления локации
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const newPoint: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          };

          setCurrentLocation(newPoint);
          setRoute(prev => [...prev, newPoint]);

          // Обновляем регион карты
          mapRef.current?.animateToRegion({
            latitude: newPoint.latitude,
            longitude: newPoint.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );
    } catch (error) {
      console.error('Error starting tracking:', error);
      Alert.alert('Ошибка', 'Не удалось начать отслеживание прогулки');
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setIsTracking(false);

    if (route.length > 1) {
      // TODO: Сохранить маршрут прогулки
      Alert.alert(
        'Прогулка завершена',
        `Длительность: ${formatDuration(duration)}\nРасстояние: ${calculateDistance(route).toFixed(2)} км`
      );
    }
  };

  const calculateDistance = (points: LocationPoint[]): number => {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      distance += getDistanceFromLatLonInKm(
        points[i - 1].latitude,
        points[i - 1].longitude,
        points[i].latitude,
        points[i].longitude
      );
    }
    return distance;
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Радиус Земли в км
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {route.length > 1 && (
            <Polyline
              coordinates={route.map(point => ({
                latitude: point.latitude,
                longitude: point.longitude,
              }))}
              strokeColor="#007AFF"
              strokeWidth={3}
            />
          )}
        </MapView>
      )}

      <View style={styles.controls}>
        <View style={styles.stats}>
          <Text style={styles.duration}>{formatDuration(duration)}</Text>
          <Text style={styles.distance}>
            {route.length > 1 ? `${calculateDistance(route).toFixed(2)} км` : '0.00 км'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isTracking ? styles.buttonStop : styles.buttonStart]}
          onPress={isTracking ? stopTracking : startTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? 'Завершить' : 'Начать прогулку'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  duration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  distance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#007AFF',
  },
  buttonStop: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 