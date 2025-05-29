import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Таймер прогулки',
    icon: 'timer-outline',
    color: '#4CAF50',
    onPress: () => console.log('Timer pressed'),
  },
  {
    id: '2',
    title: 'Запись к врачу',
    icon: 'medical-outline',
    color: '#2196F3',
    onPress: () => console.log('Vet pressed'),
  },
  {
    id: '3',
    title: 'Заметка',
    icon: 'create-outline',
    color: '#9C27B0',
    onPress: () => console.log('Note pressed'),
  },
  {
    id: '4',
    title: 'Найти компанию',
    icon: 'people-outline',
    color: '#FF9800',
    onPress: () => console.log('Find friends pressed'),
  },
];

export const QuickActions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Быстрые действия</Text>
      <View style={styles.actionsContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={action.onPress}
          >
            <Ionicons name={action.icon} size={24} color="white" />
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
}); 