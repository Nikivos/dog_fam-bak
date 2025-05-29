import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const WalkScreen = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleStartWalk = () => {
    setIsWalking(true);
    // TODO: Start tracking location
  };

  const handleStopWalk = () => {
    setIsWalking(false);
    // TODO: Stop tracking location
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}ч ${minutes % 60}м`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 55.7558,
            longitude: 37.6173,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, styles.elevation]}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientCard}
          >
            <View style={styles.statsContent}>
              <Text style={styles.statsTitle}>Расстояние</Text>
              <Text style={styles.statsValue}>{distance.toFixed(1)} км</Text>
            </View>
          </LinearGradient>
        </View>
        <View style={[styles.statsCard, styles.elevation]}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientCard}
          >
            <View style={styles.statsContent}>
              <Text style={styles.statsTitle}>Время</Text>
              <Text style={styles.statsValue}>{formatDuration(duration)}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, styles.elevation]}
        onPress={isWalking ? handleStopWalk : handleStartWalk}
      >
        <LinearGradient
          colors={isWalking ? ['#FF3B30', '#FF3B30'] : ['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionGradient}
        >
          <Ionicons name={isWalking ? 'stop' : 'play'} size={24} color="#fff" />
          <Text style={styles.actionText}>
            {isWalking ? 'Закончить прогулку' : 'Начать прогулку'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapContainer: {
    flex: 1,
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  gradientCard: {
    padding: 16,
    height: 100,
  },
  statsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statsTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButton: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
}); 