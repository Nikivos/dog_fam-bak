import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const WeatherWidget = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="sunny" size={24} color="#FF9500" />
        <Text style={styles.temperature}>+22°C</Text>
      </View>
      <Text style={styles.description}>Солнечно</Text>
      <Text style={styles.info}>Отличная погода для прогулки!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  info: {
    fontSize: 14,
    color: '#4facfe',
    marginTop: 8,
  },
}); 