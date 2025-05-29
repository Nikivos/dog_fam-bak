import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DogMap } from '../components/MapView';
import { WeatherWidget } from '../components/WeatherWidget';
import { QuickActions } from '../components/QuickActions';

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Добро пожаловать в DogFam!</Text>
        <WeatherWidget />
        <DogMap />
        <QuickActions />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
}); 