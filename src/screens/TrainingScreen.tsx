import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TrainingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тренировки</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
}); 