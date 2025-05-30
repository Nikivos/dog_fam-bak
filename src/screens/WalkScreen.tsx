import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert, Platform, AppState, TouchableOpacity } from 'react-native';
import MapView, { Polyline } from 'react-native-maps-expo';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulseButton } from '../components/PulseButton';
import { colors, spacing } from '../theme/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WalkStorage } from '../data/walkStorage';
import { Walk } from '../types/walk';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { WalkStackParamList, RootTabParamList } from '../types/navigation';

type WalkScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<WalkStackParamList, 'Walk'>,
  BottomTabNavigationProp<RootTabParamList>
>;

type WalkScreenProps = {
  navigation: WalkScreenNavigationProp;
};

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export const WalkScreen = ({ navigation }: WalkScreenProps) => {
  const [isWalking, setIsWalking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [walkPath, setWalkPath] = useState<LocationPoint[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isWalking &&
        !isPaused
      ) {
        startLocationTracking();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
      stopLocationTracking();
    };
  }, [isWalking, isPaused]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нет разрешения на использование геолокации');
      return false;
    }
    return true;
  };

  const startLocationTracking = async () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Нет разрешения на использование геолокации');
      return;
    }

    await Location.enableNetworkProviderAsync();
    
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        const newLocation = {
          latitude,
          longitude,
          timestamp: location.timestamp,
        };

        setCurrentLocation(newLocation);
        if (isWalking && !isPaused) {
          setWalkPath(prev => {
            const newPath = [...prev, newLocation];
            if (prev.length > 0) {
              const newDistance = calculateDistance(prev[prev.length - 1], newLocation);
              setDistance(d => d + newDistance);
            }
            return newPath;
          });
        }

        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    );
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const calculateDistance = (loc1: LocationPoint, loc2: LocationPoint): number => {
    const R = 6371e3; // радиус Земли в метрах
    const φ1 = (loc1.latitude * Math.PI) / 180;
    const φ2 = (loc2.latitude * Math.PI) / 180;
    const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}м`;
    }
    return `${(meters / 1000).toFixed(2)}км`;
  };

  const startWalk = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return;
    }

    setStartTime(new Date().toISOString());
    setIsWalking(true);
    setIsPaused(false);
    await startLocationTracking();

    timerRef.current = setInterval(() => {
      setElapsedTime(time => time + 1);
    }, 1000);
  };

  const pauseWalk = () => {
    setIsPaused(true);
    stopLocationTracking();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeWalk = async () => {
    setIsPaused(false);
    await startLocationTracking();
    timerRef.current = setInterval(() => {
      setElapsedTime(time => time + 1);
    }, 1000);
  };

  const finishWalk = async () => {
    if (!startTime) return;

    const walk: Walk = {
      id: Date.now().toString(),
      startTime,
      endTime: new Date().toISOString(),
      duration: elapsedTime,
      distance,
      path: walkPath,
      petId: 'current_pet_id', // TODO: Получать ID текущего питомца
      averageSpeed: distance / elapsedTime,
    };

    try {
      const storage = WalkStorage.getInstance();
      await storage.save(walk);
      
      setIsWalking(false);
      setIsPaused(false);
      stopLocationTracking();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setElapsedTime(0);
      setDistance(0);
      setWalkPath([]);
      setStartTime(null);
    } catch (error) {
      console.error('Error saving walk:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить данные прогулки');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => {
            // @ts-ignore
            navigation.getParent()?.navigate('WalkStack', {
              screen: 'WalkStats'
            });
          }}
        >
          <Ionicons name="stats-chart" size={24} color={colors.primary} />
          <Text style={styles.statsButtonText}>Статистика</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation
        >
          {walkPath.length > 1 && (
            <Polyline
              coordinates={walkPath}
              strokeColor={colors.primary}
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Время</Text>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Расстояние</Text>
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!isWalking ? (
          <View style={styles.startButtonContainer}>
            <View style={styles.combinedIconButton}>
              <PulseButton
                icon="walk"
                onPress={startWalk}
                isActive={false}
                size={80}
              />
              <View style={styles.pawIconContainer}>
                <Ionicons name="paw" size={32} color={colors.text.light} />
              </View>
            </View>
            <Text style={styles.buttonLabel}>Начать прогулку</Text>
          </View>
        ) : isPaused ? (
          <>
            <PulseButton
              icon="play"
              onPress={resumeWalk}
              color={colors.success}
              size={80}
            />
            <PulseButton
              icon="stop"
              onPress={finishWalk}
              color={colors.error}
              style={styles.secondaryButton}
              size={60}
            />
          </>
        ) : (
          <PulseButton
            icon="pause"
            onPress={pauseWalk}
            isActive={true}
            size={80}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statsButtonText: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  secondaryButton: {
    marginLeft: spacing.lg,
  },
  startButtonContainer: {
    alignItems: 'center',
  },
  buttonLabel: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.text.secondary,
  },
  combinedIconButton: {
    position: 'relative',
  },
  pawIconContainer: {
    position: 'absolute',
    right: -10,
    bottom: -5,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
}); 